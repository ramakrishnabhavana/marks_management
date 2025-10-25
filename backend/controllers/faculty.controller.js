import { FacultyHybrid } from '../models/faculty.hybrid.model.js';
import { ClassHybrid } from '../models/class.hybrid.model.js';
import { StudentMarksHybrid } from '../models/studentmarks.hybrid.model.js';
import { computeAverages } from '../utils/averages.js';

// Get faculty's classes (subjects they teach)
export const getFacultySubjects = async (req, res) => {
  try {
    const faculty = await FacultyHybrid.findOne({ facultyId: req.user.facultyId });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    // Get detailed class information for each class taught
    const classesWithDetails = await Promise.all(
      faculty.classesTaught.map(async (classInfo) => {
        const classDetails = await ClassHybrid.findOne({ classCode: classInfo.classCode });
        return {
          classCode: classInfo.classCode,
          className: classInfo.className,
          subjectCode: classInfo.subjectCode,
          subjectName: classInfo.subjectName,
          semester: classInfo.semester,
          credits: classInfo.credits,
          totalClasses: classDetails?.totalClasses || 0,
          studentCount: classDetails?.students?.length || 0
        };
      })
    );

    res.json({ subjects: classesWithDetails });
  } catch (err) {
    console.error('getFacultySubjects error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get students in a specific class
export const getStudentsInSubject = async (req, res) => {
  try {
    const { classCode } = req.params;

    // Verify faculty teaches this class
    const faculty = await FacultyHybrid.findOne({
      facultyId: req.user.facultyId,
      'classesTaught.classCode': classCode
    });
    if (!faculty) return res.status(403).json({ message: 'Unauthorized - class not assigned' });

    // Get class details with students
    const classDetails = await ClassHybrid.findOne({ classCode });
    if (!classDetails) return res.status(404).json({ message: 'Class not found' });

    // Get marks for all students in this class
    const studentMarks = await StudentMarksHybrid.find({ classCode });

    // Combine student info with marks
    const studentsWithMarks = classDetails.students.map(student => {
      const marks = studentMarks.find(m => m.rollNo === student.rollNo);
      return {
        rollNo: student.rollNo,
        name: student.name,
        marks: marks ? {
          slipTests: marks.slipTests,
          slipTestAverage: marks.slipTestAverage,
          assignments: marks.assignments,
          assignmentAverage: marks.assignmentAverage,
          mids: marks.mids,
          midAverage: marks.midAverage,
          attendanceMarks: marks.attendanceMarks,
          totalMarks: marks.totalMarks,
          remarks: marks.remarks
        } : null
      };
    });

    res.json({
      classCode,
      subjectName: classDetails.subjectName,
      students: studentsWithMarks
    });
  } catch (err) {
    console.error('getStudentsInSubject error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk upload marks for a class
export const bulkUploadMarks = async (req, res) => {
  try {
    const { classCode } = req.params;
    const { markType, marks } = req.body;

    // Verify faculty teaches this class
    const faculty = await FacultyHybrid.findOne({
      facultyId: req.user.facultyId,
      'classesTaught.classCode': classCode
    });
    if (!faculty) return res.status(403).json({ message: 'Unauthorized - class not assigned' });

    // Update marks for each student
    const updatePromises = marks.map(async ({ rollNo, value }) => {
      const updateQuery = {};
      updateQuery[markType] = value;

      // Find existing marks document or create new one
      let marksDoc = await StudentMarksHybrid.findOne({ classCode, rollNo });
      if (!marksDoc) {
        // Get student name from class
        const classDetails = await ClassHybrid.findOne({ classCode });
        const student = classDetails.students.find(s => s.rollNo === rollNo);
        if (!student) throw new Error(`Student ${rollNo} not found in class`);

        marksDoc = new StudentMarksHybrid({
          classCode,
          rollNo,
          name: student.name,
          slipTests: [],
          assignments: [],
          mids: [],
          attendanceMarks: 0,
          totalMarks: 0,
          remarks: ''
        });
      }

      // Update the specific mark type
      if (markType === 'slipTests') {
        marksDoc.slipTests = Array.isArray(value) ? value : [value];
      } else if (markType === 'assignments') {
        marksDoc.assignments = Array.isArray(value) ? value : [value];
      } else if (markType === 'mids') {
        marksDoc.mids = Array.isArray(value) ? value : [value];
      } else if (markType === 'attendanceMarks') {
        marksDoc.attendanceMarks = value;
      }

      // Recalculate averages
      const averages = computeAverages({
        slipTests: marksDoc.slipTests,
        assignments: marksDoc.assignments,
        mids: marksDoc.mids,
        attendanceMarks: marksDoc.attendanceMarks
      });

      marksDoc.slipTestAverage = averages.slipTestAverage;
      marksDoc.assignmentAverage = averages.assignmentAverage;
      marksDoc.midAverage = averages.midAverage;
      marksDoc.totalMarks = averages.totalMarks;

      return marksDoc.save();
    });

    await Promise.all(updatePromises);
    res.json({ message: 'Marks updated successfully' });
  } catch (err) {
    console.error('bulkUploadMarks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get aggregated faculty dashboard data
export const getFacultyDashboard = async (req, res) => {
  try {
    const faculty = await FacultyHybrid.findOne({ facultyId: req.user.facultyId });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    // Aggregate data for each class
    const classesData = await Promise.all(
      faculty.classesTaught.map(async (classInfo) => {
        const classDetails = await ClassHybrid.findOne({ classCode: classInfo.classCode });
        const studentMarks = await StudentMarksHybrid.find({ classCode: classInfo.classCode });

        const studentsWithMarks = classDetails.students.map(student => {
          const marks = studentMarks.find(m => m.rollNo === student.rollNo);
          return {
            rollNo: student.rollNo,
            name: student.name,
            slipTestAverage: marks?.slipTestAverage || 0,
            assignmentAverage: marks?.assignmentAverage || 0,
            midAverage: marks?.midAverage || 0,
            attendanceMarks: marks?.attendanceMarks || 0,
            totalMarks: marks?.totalMarks || 0
          };
        });

        return {
          faculty: faculty.name,
          department: faculty.department,
          classCode: classInfo.classCode,
          subject: classInfo.subjectName,
          credits: classInfo.credits,
          students: studentsWithMarks
        };
      })
    );

    res.json({ dashboard: classesData });
  } catch (err) {
    console.error('getFacultyDashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
