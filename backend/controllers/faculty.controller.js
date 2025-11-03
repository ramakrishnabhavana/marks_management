import { Faculty } from '../models/faculty.model.js';
import { FacultyAssignment } from '../models/faculty_assignments.model.js';
import { Student } from '../models/student.model.js';
import { Enrollment } from '../models/enrollments.model.js';
import { Subject } from '../models/subject.model.js';
import { Mark } from '../models/marks.model.js';

// Get faculty's subjects (subjects they teach)
export const getFacultySubjects = async (req, res) => {
  try {
    // Find faculty by user ID
    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    // Get faculty assignments
    const assignments = await FacultyAssignment.find({ faculty: faculty._id })
      .populate('subject');

    // Group by subject and sections
    const subjectsMap = new Map();

    for (const assignment of assignments) {
      const subjectCode = assignment.subject.code;
      const subjectName = assignment.subject.name;
      const sections = assignment.sections;
      const handlesLab = assignment.handlesLab;

      if (!subjectsMap.has(subjectCode)) {
        subjectsMap.set(subjectCode, {
          subjectCode,
          subjectName,
          sections: [],
          handlesLab,
          totalStudents: 0
        });
      }

      // Add sections to the subject
      const subjectData = subjectsMap.get(subjectCode);
      subjectData.sections.push(...sections);

      // Count students in these sections for this subject
      for (const section of sections) {
        const studentCount = await Student.countDocuments({ section });
        subjectData.totalStudents += studentCount;
      }
    }

    const subjects = Array.from(subjectsMap.values()).map(subject => ({
      classCode: `${subject.subjectCode}-${subject.sections.join(',')}`,
      className: subject.subjectName,
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      sections: subject.sections,
      credits: subject.handlesLab ? 2 : 3, // Assuming labs are 2 credits, theory 3
      studentCount: subject.totalStudents,
      isLab: subject.handlesLab
    }));

    res.json({ subjects });
  } catch (err) {
    console.error('getFacultySubjects error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get students in a specific subject/section combination
export const getStudentsInSubject = async (req, res) => {
  try {
    const { classCode } = req.params; // Format: SUBJECTCODE-SECTION1,SECTION2

    // Parse classCode
    const [subjectCode, sectionsStr] = classCode.split('-');
    const sections = sectionsStr.split(',');

    // Verify faculty teaches this subject
    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) return res.status(403).json({ message: 'Faculty not found' });

    const assignment = await FacultyAssignment.findOne({
      faculty: faculty._id,
      subject: await Subject.findOne({ code: subjectCode }).then(s => s?._id)
    });

    if (!assignment) return res.status(403).json({ message: 'Unauthorized - subject not assigned' });

    // Get students in the specified sections enrolled in this subject
    const studentIds = await Student.find({ section: { $in: sections } }).distinct('_id');
    const enrollments = await Enrollment.find({
      subject: assignment.subject,
      student: { $in: studentIds }
    }).populate({ path: 'student', model: Student });

    // Get existing marks for these students
    const marks = await Mark.find({
      subject: assignment.subject,
      student: { $in: enrollments.map(e => e.student._id) }
    });

    // Combine student info with marks
    const studentsWithMark = enrollments.map(enrollment => {
      const student = enrollment.student;
      const studentMark = marks.find(m => m.student.toString() === student._id.toString());

      return {
        rollNo: student.roll,
        name: student.roll, // Using roll as name since we don't have names
        section: student.section,
        marks: studentMark ? {
          slipTests: studentMark.slipTests || [],
          slipTestAverage: studentMark.slipTestAverage || 0,
          assignments: studentMark.assignments || [],
          assignmentAverage: studentMark.assignmentAverage || 0,
          classTests: studentMark.classTests || [],
          classTestAverage: studentMark.classTestAverage || 0,
          attendanceMark: studentMark.attendanceMark || 0,
          totalMark: studentMark.totalMark || 0,
          remarks: studentMark.remarks || ''
        } : null
      };
    });

    res.json({
      classCode,
      subjectName: await Subject.findById(assignment.subject).then(s => s.name),
      sections,
      students: studentsWithMark
    });
  } catch (err) {
    console.error('getStudentsInSubject error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk upload marks for a subject/section combination
export const bulkUploadMarks = async (req, res) => {
  try {
    const { classCode } = req.params;
    const { markType, marks } = req.body;

    // Parse classCode
    const [subjectCode, sectionsStr] = classCode.split('-');
    const sections = sectionsStr.split(',');

    // Verify faculty teaches this subject
    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) return res.status(403).json({ message: 'Faculty not found' });

    const subject = await Subject.findOne({ code: subjectCode });
    const assignment = await FacultyAssignment.findOne({
      faculty: faculty._id,
      subject: subject._id
    });

    if (!assignment) return res.status(403).json({ message: 'Unauthorized - subject not assigned' });

    // Process marks for each student
    const updatePromises = marks.map(async ({ rollNo, value }) => {
      // Find student
      const student = await Student.findOne({ roll: rollNo });
      if (!student) throw new Error(`Student ${rollNo} not found`);

      // Find or create marks document
      let marksDoc = await Mark.findOne({
        student: student._id,
        subject: subject._id
      });

      if (!marksDoc) {
        marksDoc = new Mark({
          student: student._id,
          subject: subject._id,
          slipTests: [],
          assignments: [],
          classTests: [],
          attendanceMark: 0,
          totalMark: 0,
          remarks: ''
        });
      }

      // Update the specific mark type
      if (markType === 'slipTests') {
        marksDoc.slipTests = Array.isArray(value) ? value : [value];
      } else if (markType === 'assignments') {
        marksDoc.assignments = Array.isArray(value) ? value : [value];
      } else if (markType === 'classTests') {
        marksDoc.classTests = Array.isArray(value) ? value : [value];
      } else if (markType === 'attendanceMark') {
        marksDoc.attendanceMark = value;
      }

      // Recalculate totals (simplified calculation)
      const slipTestAvg = marksDoc.slipTests.length > 0 ? marksDoc.slipTests.reduce((a, b) => a + b, 0) / marksDoc.slipTests.length : 0;
      const assignmentAvg = marksDoc.assignments.length > 0 ? marksDoc.assignments.reduce((a, b) => a + b, 0) / marksDoc.assignments.length : 0;
      const classTestAvg = marksDoc.classTests.length > 0 ? marksDoc.classTests.reduce((a, b) => a + b, 0) / marksDoc.classTests.length : 0;

      marksDoc.slipTestAverage = slipTestAvg;
      marksDoc.assignmentAverage = assignmentAvg;
      marksDoc.classTestAverage = classTestAvg;
      marksDoc.totalMark = slipTestAvg + assignmentAvg + classTestAvg + marksDoc.attendanceMark;

      return marksDoc.save();
    });

    await Promise.all(updatePromises);
    res.json({ message: 'Mark updated successfully' });
  } catch (err) {
    console.error('bulkUploadMarks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get aggregated faculty dashboard data
export const getFacultyDashboard = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    // Get all assignments for this faculty
    const assignments = await FacultyAssignment.find({ faculty: faculty._id })
      .populate('subject')
      .populate('sections');

    const dashboard = [];

    for (const assignment of assignments) {
      const subject = assignment.subject;
      const sections = assignment.sections;

      // Get all students in these sections enrolled in this subject
      const studentIds = await Student.find({ section: { $in: sections } }).distinct('_id');
      const enrollments = await Enrollment.find({
        subject: subject._id,
        student: { $in: studentIds }
      }).populate('student');

      // Get marks for these students
      const marks = await Mark.find({
        subject: subject._id,
        student: { $in: enrollments.map(e => e.student._id) }
      });

      const studentsWithMark = enrollments.map(enrollment => {
        const student = enrollment.student;
        const studentMark = marks.find(m => m.student.toString() === student._id.toString());

        return {
          rollNo: student.roll,
          name: student.roll,
          section: student.section,
          slipTestAverage: studentMark?.slipTestAverage || 0,
          assignmentAverage: studentMark?.assignmentAverage || 0,
          classTestAverage: studentMark?.classTestAverage || 0,
          attendanceMark: studentMark?.attendanceMark || 0,
          totalMark: studentMark?.totalMark || 0
        };
      });

      dashboard.push({
        faculty: faculty.name,
        department: 'IT', // Assuming department
        classCode: `${subject.code}-${sections.join(',')}`,
        subject: subject.name,
        credits: assignment.handlesLab ? 2 : 3,
        sections,
        students: studentsWithMark
      });
    }

    res.json({ dashboard });
  } catch (err) {
    console.error('getFacultyDashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
