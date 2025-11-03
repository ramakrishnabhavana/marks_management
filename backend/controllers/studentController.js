import { Student } from '../models/Student.js';
import { Marks } from '../models/Marks.js';
import { Subject } from '../models/Subject.js';
import { Enrollment } from '../models/Enrollment.js';

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('mentor', 'name email mobile');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get all enrollments with subjects
    const enrollments = await Enrollment.find({ student: student._id })
      .populate('subject')
      .populate('faculty', 'name email');

    // Get marks for ALL subjects in parallel for better performance
    const marksData = await Marks.find({ student: student._id })
      .populate('subject', 'code name credits type maxMarks')
      .populate('faculty', 'name');

    // Structure data with nested marks - REAL-TIME DATA
    const subjectsWithMarks = enrollments.map(enrollment => {
      const subjectMarks = marksData.find(mark =>
        mark.subject._id.toString() === enrollment.subject._id.toString()
      );

      // Calculate current totals based on latest marks
      let totalCieMarks = 0;
      let marksBreakdown = {};

      if (subjectMarks) {
        // For theory subjects
        if (enrollment.subject.type === 'theory') {
          const slipTestAvg = subjectMarks.slipTests.length > 0 ?
            subjectMarks.slipTests.reduce((a, b) => a + b.marks, 0) / subjectMarks.slipTests.length : 0;

          const assignmentAvg = subjectMarks.assignments.length > 0 ?
            subjectMarks.assignments.reduce((a, b) => a + b.marks, 0) / subjectMarks.assignments.length : 0;

          const internalTestAvg = subjectMarks.internalTests.length > 0 ?
            subjectMarks.internalTests.reduce((a, b) => a + b.marks, 0) / subjectMarks.internalTests.length : 0;

          totalCieMarks = slipTestAvg + assignmentAvg + internalTestAvg + (subjectMarks.attendance?.marks || 0);

          marksBreakdown = {
            slipTests: subjectMarks.slipTests,
            assignments: subjectMarks.assignments,
            internalTests: subjectMarks.internalTests,
            attendance: subjectMarks.attendance,
            slipTestAverage: slipTestAvg,
            assignmentAverage: assignmentAvg,
            internalTestAverage: internalTestAvg
          };
        }
        // For lab subjects
        else if (enrollment.subject.type === 'lab') {
          const labRecordTotal = subjectMarks.labRecords.reduce((sum, lr) => sum + lr.marks, 0);
          const labTestTotal = subjectMarks.labTests.reduce((sum, lt) => sum + lt.marks, 0);

          totalCieMarks = labRecordTotal + labTestTotal + (subjectMarks.attendance?.marks || 0);

          marksBreakdown = {
            labRecords: subjectMarks.labRecords,
            labTests: subjectMarks.labTests,
            attendance: subjectMarks.attendance,
            labRecordTotal: labRecordTotal,
            labTestTotal: labTestTotal
          };
        }
      }

      return {
        subject: {
          code: enrollment.subject.code,
          name: enrollment.subject.name,
          credits: enrollment.subject.credits,
          type: enrollment.subject.type,
          maxMarks: enrollment.subject.maxMarks?.cie || 40
        },
        faculty: enrollment.faculty,
        enrollment: {
          chosenAsElective: enrollment.chosenAsElective,
          electiveGroup: enrollment.electiveGroup
        },
        marks: subjectMarks ? {
          ...marksBreakdown,
          totalCieMarks: totalCieMarks,
          grade: subjectMarks.grade,
          remarks: subjectMarks.remarks,
          lastUpdated: subjectMarks.lastUpdated
        } : null
      };
    });

    res.json({
      student: {
        id: student._id,
        rollNo: student.rollNo,
        name: student.name,
        section: student.section,
        year: student.year,
        semester: student.semester,
        department: student.department,
        contact: student.contact,
        mentor: student.mentor
      },
      academicProfile: {
        semester: student.semester,
        totalSubjects: enrollments.length,
        subjects: subjectsWithMarks,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentMarksBySubject = async (req, res) => {
  try {
    const { subjectCode } = req.params;

    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const subject = await Subject.findOne({ code: subjectCode });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    // Verify enrollment
    const enrollment = await Enrollment.findOne({
      student: student._id,
      subject: subject._id
    }).populate('faculty', 'name email');

    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this subject' });
    }

    const marks = await Marks.findOne({
      student: student._id,
      subject: subject._id
    }).populate('faculty', 'name');

    // Calculate real-time marks breakdown
    let marksBreakdown = {};
    let totalCieMarks = 0;

    if (marks) {
      if (subject.type === 'theory') {
        const slipTestAvg = marks.slipTests.length > 0 ?
          marks.slipTests.reduce((a, b) => a + b.marks, 0) / marks.slipTests.length : 0;

        const assignmentAvg = marks.assignments.length > 0 ?
          marks.assignments.reduce((a, b) => a + b.marks, 0) / marks.assignments.length : 0;

        const internalTestAvg = marks.internalTests.length > 0 ?
          marks.internalTests.reduce((a, b) => a + b.marks, 0) / marks.internalTests.length : 0;

        totalCieMarks = slipTestAvg + assignmentAvg + internalTestAvg + (marks.attendance?.marks || 0);

        marksBreakdown = {
          slipTests: marks.slipTests,
          assignments: marks.assignments,
          internalTests: marks.internalTests,
          attendance: marks.attendance,
          slipTestAverage: parseFloat(slipTestAvg.toFixed(2)),
          assignmentAverage: parseFloat(assignmentAvg.toFixed(2)),
          internalTestAverage: parseFloat(internalTestAvg.toFixed(2))
        };
      } else if (subject.type === 'lab') {
        const labRecordTotal = marks.labRecords.reduce((sum, lr) => sum + lr.marks, 0);
        const labTestTotal = marks.labTests.reduce((sum, lt) => sum + lt.marks, 0);

        totalCieMarks = labRecordTotal + labTestTotal + (marks.attendance?.marks || 0);

        marksBreakdown = {
          labRecords: marks.labRecords,
          labTests: marks.labTests,
          attendance: marks.attendance,
          labRecordTotal: labRecordTotal,
          labTestTotal: labTestTotal
        };
      }
    }

    res.json({
      subject: {
        code: subject.code,
        name: subject.name,
        credits: subject.credits,
        type: subject.type,
        maxMarks: subject.maxMarks?.cie || (subject.type === 'theory' ? 40 : 50)
      },
      faculty: enrollment.faculty,
      marks: marks ? {
        ...marksBreakdown,
        totalCieMarks: parseFloat(totalCieMarks.toFixed(2)),
        grade: marks.grade,
        remarks: marks.remarks,
        lastUpdated: marks.lastUpdated
      } : null,
      lastFetched: new Date()
    });
  } catch (error) {
    console.error('Get student marks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
