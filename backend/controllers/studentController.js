import Student from '../models/Student.js';
import Marks from '../models/Marks.js';
import Subject from '../models/Subject.js';
import Enrollment from '../models/Enrollment.js';

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
        // Normalize flat schema into array-shaped representation for calculations
        if (enrollment.subject.type === 'theory') {
          // build slipTests array from slipTest1..3
          const slipTestsArr = [];
          [1,2,3].forEach(i => {
            const v = subjectMarks[`slipTest${i}`];
            if (v !== null && v !== undefined) slipTestsArr.push({ testNumber: i, marks: v });
          });

          const bestSlipTests = slipTestsArr.slice().sort((a,b) => b.marks - a.marks).slice(0,2);
          const slipTestAvg = bestSlipTests.length > 0 ? bestSlipTests.reduce((a,b) => a + b.marks, 0) / bestSlipTests.length : 0;

          const assignmentsArr = [];
          [1,2].forEach(i => {
            const v = subjectMarks[`assignment${i}`];
            if (v !== null && v !== undefined) assignmentsArr.push({ assignmentNumber: i, marks: v });
          });
          const assignmentAvg = assignmentsArr.length > 0 ? assignmentsArr.reduce((a,b) => a + b.marks, 0) / assignmentsArr.length : 0;

          const internalArr = [];
          [1,2].forEach(i => {
            const v = subjectMarks[`internalTest${i}`];
            if (v !== null && v !== undefined) internalArr.push({ testNumber: i, marks: v });
          });
          const internalTestAvg = internalArr.length > 0 ? internalArr.reduce((a,b) => a + b.marks, 0) / internalArr.length : 0;

          const attendanceMark = (typeof subjectMarks.attendance === 'number') ? subjectMarks.attendance : (subjectMarks.attendance?.marks || 0);

          totalCieMarks = slipTestAvg + assignmentAvg + internalTestAvg + (attendanceMark || 0);

          marksBreakdown = {
            slipTests: slipTestsArr,
            assignments: assignmentsArr,
            internalTests: internalArr,
            attendance: subjectMarks.attendance,
            slipTestAverage: parseFloat(slipTestAvg.toFixed(2)),
            assignmentAverage: parseFloat(assignmentAvg.toFixed(2)),
            internalTestAverage: parseFloat(internalTestAvg.toFixed(2)),
            bestTwoSlipTests: bestSlipTests
          };
        }
        // For lab subjects
        else if (enrollment.subject.type === 'lab') {
          const labRecordsArr = [];
          for (let i=1;i<=10;i++){
            const v = subjectMarks[`weeklyCIE${i}`];
            if (v !== null && v !== undefined) labRecordsArr.push({ experiment: `weeklyCIE${i}`, marks: v });
          }

          const labTestsArr = [];
          [1,2].forEach(i => {
            const v = subjectMarks[`internalTest${i}`];
            if (v !== null && v !== undefined) labTestsArr.push({ testNumber: i, marks: v });
          });

          const labRecordTotal = labRecordsArr.reduce((sum, lr) => sum + lr.marks, 0);
          const labTestTotal = labTestsArr.reduce((sum, lt) => sum + lt.marks, 0);

          const attendanceMark = (typeof subjectMarks.attendance === 'number') ? subjectMarks.attendance : (subjectMarks.attendance?.marks || 0);

          totalCieMarks = labRecordTotal + labTestTotal + (attendanceMark || 0);

          marksBreakdown = {
            labRecords: labRecordsArr,
            labTests: labTestsArr,
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
          totalCieMarks: parseFloat(totalCieMarks.toFixed(2)),
          grade: subjectMarks.grade,
          remarks: subjectMarks.remarks,
          lastUpdated: subjectMarks.lastUpdated
        } : {
          // Initialize with zero marks if no marks exist
          slipTests: [],
          assignments: [],
          internalTests: [],
          attendance: { marks: 0, classesHeld: 0, classesAttended: 0 },
          slipTestAverage: 0,
          assignmentAverage: 0,
          internalTestAverage: 0,
          totalCieMarks: 0,
          bestTwoSlipTests: []
        }
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
        // build arrays from flat fields
        const slipTestsArr = [];
        [1,2,3].forEach(i => {
          const v = marks[`slipTest${i}`];
          if (v !== null && v !== undefined) slipTestsArr.push({ testNumber: i, marks: v });
        });

        const bestSlipTests = slipTestsArr.slice().sort((a,b) => b.marks - a.marks).slice(0,2);
        const slipTestAvg = bestSlipTests.length > 0 ? bestSlipTests.reduce((a,b) => a + b.marks, 0) / bestSlipTests.length : 0;

        const assignmentsArr = [];
        [1,2].forEach(i => {
          const v = marks[`assignment${i}`];
          if (v !== null && v !== undefined) assignmentsArr.push({ assignmentNumber: i, marks: v });
        });
        const assignmentAvg = assignmentsArr.length > 0 ? assignmentsArr.reduce((a,b) => a + b.marks, 0) / assignmentsArr.length : 0;

        const internalArr = [];
        [1,2].forEach(i => {
          const v = marks[`internalTest${i}`];
          if (v !== null && v !== undefined) internalArr.push({ testNumber: i, marks: v });
        });
        const internalTestAvg = internalArr.length > 0 ? internalArr.reduce((a,b) => a + b.marks, 0) / internalArr.length : 0;

        const attendanceMark = (typeof marks.attendance === 'number') ? marks.attendance : (marks.attendance?.marks || 0);

        totalCieMarks = slipTestAvg + assignmentAvg + internalTestAvg + (attendanceMark || 0);

        marksBreakdown = {
          slipTests: slipTestsArr,
          assignments: assignmentsArr,
          internalTests: internalArr,
          attendance: marks.attendance,
          slipTestAverage: parseFloat(slipTestAvg.toFixed(2)),
          assignmentAverage: parseFloat(assignmentAvg.toFixed(2)),
          internalTestAverage: parseFloat(internalTestAvg.toFixed(2)),
          bestTwoSlipTests: bestSlipTests
        };
      } else if (subject.type === 'lab') {
        const labRecordsArr = [];
        for (let i=1;i<=10;i++){
          const v = marks[`weeklyCIE${i}`];
          if (v !== null && v !== undefined) labRecordsArr.push({ experiment: `weeklyCIE${i}`, marks: v });
        }

        const labTestsArr = [];
        [1,2].forEach(i => {
          const v = marks[`internalTest${i}`];
          if (v !== null && v !== undefined) labTestsArr.push({ testNumber: i, marks: v });
        });

        const labRecordTotal = labRecordsArr.reduce((sum, lr) => sum + lr.marks, 0);
        const labTestTotal = labTestsArr.reduce((sum, lt) => sum + lt.marks, 0);

        const attendanceMark = (typeof marks.attendance === 'number') ? marks.attendance : (marks.attendance?.marks || 0);

        totalCieMarks = labRecordTotal + labTestTotal + (attendanceMark || 0);

        marksBreakdown = {
          labRecords: labRecordsArr,
          labTests: labTestsArr,
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
