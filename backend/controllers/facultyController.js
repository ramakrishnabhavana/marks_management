import mongoose from 'mongoose';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import Subject from '../models/Subject.js';
import Marks from '../models/Marks.js';
import Enrollment from '../models/Enrollment.js';
import FacultyAssignment from '../models/FacultyAssignment.js';
import xlsx from 'xlsx';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

export const getFacultySubjects = async (req, res) => {
  try {
    console.log('Fetching faculty subjects for user:', req.user.id);

    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) {
      console.log('Faculty not found for user:', req.user.id);
      return res.status(404).json({ message: 'Faculty not found' });
    }

    console.log('Found faculty:', faculty.name);

    // Get faculty assignments with student details
    const assignments = await FacultyAssignment.find({ faculty: faculty._id })
      .populate('subject', 'code name credits type');

    console.log('Faculty assignments found:', assignments.length);

    const subjectsWithDetails = await Promise.all(
      assignments.map(async (assignment) => {
        // Get students for each section
        const sectionDetails = await Promise.all(
          assignment.sections.map(async (section) => {
            const enrollments = await Enrollment.find({
              subject: assignment.subject._id,
              section: section
            }).populate('student', 'rollNo name');

            const students = enrollments.map(enrollment => ({
              rollNo: enrollment.student.rollNo,
              name: enrollment.student.name
            }));

            return {
              section,
              studentCount: students.length,
              students
            };
          })
        );

        // Use the first section for class code
        const primarySection = assignment.sections[0];
        const primarySectionDetail = sectionDetails.find(sd => sd.section === primarySection);

        return {
          classCode: `${assignment.subject.code}-${primarySection}`,
          subjectCode: assignment.subject.code,
          subjectName: assignment.subject.name,
          subjectId: assignment.subject._id,
          credits: assignment.subject.credits,
          type: assignment.subject.type,
          sections: sectionDetails,
          studentCount: primarySectionDetail?.studentCount || 0,
          students: primarySectionDetail?.students || [],
          semester: assignment.semester
        };
      })
    );

    console.log('Sending faculty subjects response');
    res.json({
      faculty: {
        name: faculty.name,
        department: faculty.department
      },
      subjects: subjectsWithDetails
    });
  } catch (error) {
    console.error('Get faculty subjects error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export const getClassStudents = async (req, res) => {
  try {
    const { classCode } = req.params;
    console.log('Fetching students for class:', classCode);

    // classCode is constructed as `${subject.code}-${section}`, but both
    // subject.code and section may contain hyphens. To reliably parse, try
    // every possible split position at '-' and check which left-hand side
    // corresponds to a Subject.code in the database.
    let subjectCode = null;
    let section = null;

    if (typeof classCode !== 'string') {
      return res.status(400).json({ message: 'Invalid classCode' });
    }

    // collect indices of dashes
    const dashIndices = [];
    for (let i = 0; i < classCode.length; i++) {
      if (classCode[i] === '-') dashIndices.push(i);
    }

    // try splits at each dash from left to right (prefer shortest subject code)
    for (const idx of dashIndices) {
      const candidateSub = classCode.slice(0, idx);
      const candidateSection = classCode.slice(idx + 1);
      // check if the subject exists for this candidate
      // we don't `await` here yet in loop body; but we need to query DB synchronously
      // so do an awaited lookup
      // eslint-disable-next-line no-await-in-loop
      const found = await Subject.findOne({ code: candidateSub });
      if (found) {
        subjectCode = candidateSub;
        section = candidateSection;
        break;
      }
    }

    // If none matched, return bad request
    if (!subjectCode) {
      return res.status(400).json({ message: 'Unable to parse classCode or subject not found' });
    }

    console.log('Parsed - Subject:', subjectCode, 'Section:', section);

    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    const subject = await Subject.findOne({ code: subjectCode });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    // Verify faculty teaches this subject and section
    const assignment = await FacultyAssignment.findOne({
      faculty: faculty._id,
      subject: subject._id,
      sections: { $in: [section] }
    });

    if (!assignment) {
      console.log('Faculty not authorized for this class');
      return res.status(403).json({ message: 'Not authorized for this class' });
    }

    // Get enrolled students
    const enrollments = await Enrollment.find({
      subject: subject._id,
      section: section
    }).populate('student', 'rollNo name');

    console.log('Enrollments found:', enrollments.length);

    const studentsWithMarks = await Promise.all(
      enrollments.map(async (enrollment) => {
        const marks = await Marks.findOne({
          student: enrollment.student._id,
          subject: subject._id
        });

        let marksSummary = {};
        if (marks) {
          if (subject.type === 'theory') {
            // Calculate CIE marks according to the specified rules
            const slipTests = [marks.slipTest1, marks.slipTest2, marks.slipTest3].filter(m => m !== null && m !== undefined);
            const bestSlipTests = slipTests.slice().sort((a, b) => b - a).slice(0, 2);
            const slipTestAvg = bestSlipTests.length > 0 ? bestSlipTests.reduce((a, b) => a + b, 0) / bestSlipTests.length : 0;

            const assignments = [marks.assignment1, marks.assignment2].filter(m => m !== null && m !== undefined);
            const assignmentAvg = assignments.length > 0 ? assignments.reduce((a, b) => a + b, 0) / assignments.length : 0;

            const classTests = [marks.classTest1, marks.classTest2].filter(m => m !== null && m !== undefined);
            const classTestAvg = classTests.length > 0 ? classTests.reduce((a, b) => a + b, 0) / classTests.length : 0;

            const attendanceMark = (typeof marks.attendance === 'number') ? marks.attendance : (marks.attendance?.marks || 0);
            const totalMarks = slipTestAvg + assignmentAvg + classTestAvg + (attendanceMark || 0);

            marksSummary = {
              totalMarks: parseFloat(totalMarks.toFixed(2)),
              // Include individual marks for input population
              slipTest1: marks.slipTest1 || null,
              slipTest2: marks.slipTest2 || null,
              slipTest3: marks.slipTest3 || null,
              assignment1: marks.assignment1 || null,
              assignment2: marks.assignment2 || null,
              classTest1: marks.classTest1 || null,
              classTest2: marks.classTest2 || null,
              attendance: marks.attendance || null
            };
          } else {
            // Calculate total as sum for lab subjects
            const weeklyCIEs = [
              marks.weeklyCIE1, marks.weeklyCIE2, marks.weeklyCIE3, marks.weeklyCIE4, marks.weeklyCIE5,
              marks.weeklyCIE6, marks.weeklyCIE7, marks.weeklyCIE8, marks.weeklyCIE9, marks.weeklyCIE10
            ].filter(m => m !== null);
            const weeklySum = weeklyCIEs.reduce((a, b) => a + b, 0);

            const internalTests = [marks.internalTest1, marks.internalTest2].filter(m => m !== null);
            const internalSum = internalTests.reduce((a, b) => a + b, 0);

            const totalMarks = weeklySum + internalSum + (marks.attendance || 0);

            marksSummary = {
              totalMarks: parseFloat(totalMarks.toFixed(2)),
              // Include individual marks for lab subjects
              weeklyCIE1: marks.weeklyCIE1 || null,
              weeklyCIE2: marks.weeklyCIE2 || null,
              weeklyCIE3: marks.weeklyCIE3 || null,
              weeklyCIE4: marks.weeklyCIE4 || null,
              weeklyCIE5: marks.weeklyCIE5 || null,
              weeklyCIE6: marks.weeklyCIE6 || null,
              weeklyCIE7: marks.weeklyCIE7 || null,
              weeklyCIE8: marks.weeklyCIE8 || null,
              weeklyCIE9: marks.weeklyCIE9 || null,
              weeklyCIE10: marks.weeklyCIE10 || null,
              internalTest1: marks.internalTest1 || null,
              internalTest2: marks.internalTest2 || null,
              attendance: marks.attendance || null
            };
          }
        } else {
          // Default empty marks
          if (subject.type === 'theory') {
            marksSummary = {
              totalMarks: 0,
              slipTest1: null,
              slipTest2: null,
              slipTest3: null,
              assignment1: null,
              assignment2: null,
              classTest1: null,
              classTest2: null,
              attendance: null
            };
          } else {
            marksSummary = {
              totalMarks: 0,
              weeklyCIE1: null,
              weeklyCIE2: null,
              weeklyCIE3: null,
              weeklyCIE4: null,
              weeklyCIE5: null,
              weeklyCIE6: null,
              weeklyCIE7: null,
              weeklyCIE8: null,
              weeklyCIE9: null,
              weeklyCIE10: null,
              internalTest1: null,
              internalTest2: null,
              attendance: null
            };
          }
        }

        return {
          rollNo: enrollment.student.rollNo,
          name: enrollment.student.name,
          marks: marksSummary
        };
      })
    );

    console.log('Sending students response');
    res.json({
      subject: {
        code: subject.code,
        name: subject.name,
        type: subject.type
      },
      section,
      students: studentsWithMarks
    });
  } catch (error) {
    console.error('Get class students error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export const getFacultyProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user.id })
      .populate('subjects', 'code name credits type');

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Get faculty assignments
    const assignments = await FacultyAssignment.find({ faculty: faculty._id })
      .populate('subject', 'code name credits type semester')
      .sort({ semester: -1 });

    res.json({
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        mobile: faculty.mobile,
        department: faculty.department,
        designation: faculty.designation
      },
      assignments: assignments.map(assignment => ({
        subject: assignment.subject,
        sections: assignment.sections,
        semester: assignment.semester,
        academicYear: assignment.academicYear
      }))
    });
  } catch (error) {
    console.error('Get faculty profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentsForSubject = async (req, res) => {
  try {
    const { subjectCode, section } = req.params;

    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    const subject = await Subject.findOne({ code: subjectCode });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    // Verify faculty teaches this subject and section
    const assignment = await FacultyAssignment.findOne({
      faculty: faculty._id,
      subject: subject._id,
      sections: { $in: [section] }
    });

    if (!assignment) {
      return res.status(403).json({ message: 'Not authorized for this subject/section' });
    }

    // Get enrolled students with their current marks
    const enrollments = await Enrollment.find({
      subject: subject._id,
      section: section
    }).populate('student', 'rollNo name section');

    // Get ALL marks for these students in this subject
    const marksData = await Marks.find({
      subject: subject._id,
      student: { $in: enrollments.map(e => e.student._id) }
    });

    const studentsWithMarks = enrollments.map(enrollment => {
      const studentMarks = marksData.find(mark =>
        mark.student._id.toString() === enrollment.student._id.toString()
      );

      // Calculate current averages and totals
      let marksSummary = {};

      if (studentMarks) {
        // Prefer flat fields (slipTest1..3, assignment1..2, classTest1..2) which match Marks.js
        if (subject.type === 'theory') {
          const slipTests = [studentMarks.slipTest1, studentMarks.slipTest2, studentMarks.slipTest3].filter(m => m !== null && m !== undefined);
          const bestSlipTests = slipTests.slice().sort((a, b) => b - a).slice(0, 2);
          const slipTestAvg = bestSlipTests.length > 0 ? bestSlipTests.reduce((a, b) => a + b, 0) / bestSlipTests.length : 0;

          const assignments = [studentMarks.assignment1, studentMarks.assignment2].filter(m => m !== null && m !== undefined);
          const assignmentAvg = assignments.length > 0 ? assignments.reduce((a, b) => a + b, 0) / assignments.length : 0;

          const classTests = [studentMarks.classTest1, studentMarks.classTest2].filter(m => m !== null && m !== undefined);
          const classTestAvg = classTests.length > 0 ? classTests.reduce((a, b) => a + b, 0) / classTests.length : 0;

          // attendance might be a number (bulk upload) or an object (legacy). Handle both.
          const attendanceMark = (typeof studentMarks.attendance === 'number') ? studentMarks.attendance : (studentMarks.attendance?.marks || 0);

          marksSummary = {
            slipTestAverage: parseFloat(slipTestAvg.toFixed(2)),
            assignmentAverage: parseFloat(assignmentAvg.toFixed(2)),
            classTestAverage: parseFloat(classTestAvg.toFixed(2)),
            attendanceMark: attendanceMark || 0,
            totalMark: slipTestAvg + assignmentAvg + classTestAvg + (attendanceMark || 0)
          };
        }
      }

      return {
        student: enrollment.student,
        enrollment: {
          chosenAsElective: enrollment.chosenAsElective,
          electiveGroup: enrollment.electiveGroup
        },
        marks: studentMarks ? (function() {
          // build array-shaped representation from flat fields so front-end that expects arrays still works
          const slipTestsArr = [];
          [1,2,3].forEach(i => {
            const v = studentMarks[`slipTest${i}`];
            if (v !== null && v !== undefined) slipTestsArr.push({ testNumber: i, marks: v });
          });

          const assignmentsArr = [];
          [1,2].forEach(i => {
            const v = studentMarks[`assignment${i}`];
            if (v !== null && v !== undefined) assignmentsArr.push({ assignmentNumber: i, marks: v });
          });

          const internalTestsArr = [];
          [1,2].forEach(i => {
            const v = studentMarks[`internalTest${i}`];
            if (v !== null && v !== undefined) internalTestsArr.push({ testNumber: i, marks: v });
          });

          // weekly CIEs (lab records)
          const labRecordsArr = [];
          for (let i=1;i<=10;i++){
            const v = studentMarks[`weeklyCIE${i}`];
            if (v !== null && v !== undefined) labRecordsArr.push({ experiment: `weeklyCIE${i}`, marks: v });
          }

          // labTests map to internalTest fields where applicable
          const labTestsArr = internalTestsArr.slice();

          return {
            slipTests: slipTestsArr,
            assignments: assignmentsArr,
            internalTests: internalTestsArr,
            labRecords: labRecordsArr,
            labTests: labTestsArr,
            attendance: studentMarks.attendance,
            ...marksSummary,
            grade: studentMarks.grade,
            remarks: studentMarks.remarks,
            lastUpdated: studentMarks.lastUpdated
          };
        })() : null
      };
    });

    res.json({
      subject: {
        code: subject.code,
        name: subject.name,
        credits: subject.credits,
        type: subject.type
      },
      section,
      faculty: faculty.name,
      students: studentsWithMarks,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Get students for subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStudentMarks = async (req, res) => {
  try {
    const { studentRollNo, subjectCode, markType, marksData, section } = req.body;

    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    const student = await Student.findOne({ rollNo: studentRollNo });
    const subject = await Subject.findOne({ code: subjectCode });

    if (!student || !subject) {
      return res.status(404).json({ message: 'Student or subject not found' });
    }

    // Verify faculty teaches this subject and section
    const assignment = await FacultyAssignment.findOne({
      faculty: faculty._id,
      subject: subject._id,
      sections: { $in: [section || student.section] }
    });

    if (!assignment) {
      return res.status(403).json({ message: 'Not authorized to update marks for this subject' });
    }

    // Find or create marks document
    let marks = await Marks.findOne({
      student: student._id,
      subject: subject._id,
      faculty: faculty._id
    });

    if (!marks) {
      marks = new Marks({
        student: student._id,
        subject: subject._id,
        faculty: faculty._id,
        semester: subject.semester,
        section: section || student.section,
        enteredBy: req.user.id
      });
    }

    // Update specific mark type based on faculty selection
    // Use flat fields that exist on Marks schema (slipTest1..3, assignment1..2, internalTest1..2, weeklyCIE1..10)
    const setNextOrNumbered = (fieldPrefix, maxSlots = 3, testNumber) => {
      if (testNumber) {
        const field = `${fieldPrefix}${testNumber}`;
        marks[field] = marksData.marks;
        return;
      }

      // pick first empty slot
      for (let i = 1; i <= maxSlots; i++) {
        const field = `${fieldPrefix}${i}`;
        if (marks[field] === null || marks[field] === undefined) {
          marks[field] = marksData.marks;
          return;
        }
      }

      // overwrite the last slot if all full
      marks[`${fieldPrefix}${maxSlots}`] = marksData.marks;
    };

    switch (markType) {
      case 'slipTest':
        // marksData.testNumber (1..3) optional
        setNextOrNumbered('slipTest', 3, marksData.testNumber);
        break;

      case 'assignment':
        setNextOrNumbered('assignment', 2, marksData.testNumber);
        break;

      case 'internalTest':
        setNextOrNumbered('internalTest', 2, marksData.testNumber);
        break;

      case 'attendance':
        // accept numeric attendance or object with .marks
        if (typeof marksData.marks === 'number') {
          marks.attendance = marksData.marks;
        } else {
          // keep legacy object shape if provided
          marks.attendance = { ...(marks.attendance || {}), ...marksData, lastUpdated: new Date() };
        }
        break;

      case 'labRecord':
        // map to weeklyCIE slots (1..10)
        setNextOrNumbered('weeklyCIE', 10, marksData.testNumber);
        break;

      case 'labTest':
        // map to internalTest slots for lab tests if applicable
        setNextOrNumbered('internalTest', 2, marksData.testNumber);
        break;

      default:
        return res.status(400).json({ message: 'Invalid mark type' });
    }

    marks.lastUpdated = new Date();
    marks.enteredBy = req.user.id;

    await marks.save();

    // Return updated marks with calculations
    const updatedMarks = await Marks.findById(marks._id)
      .populate('student', 'rollNo name')
      .populate('subject', 'code name type');

    res.json({
      message: 'Marks updated successfully',
      marks: updatedMarks,
      markType,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Update marks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const bulkUpdateMarks = async (req, res) => {
  try {
    // Accept either { subjectCode, section } or { classCode } from client.
    let { subjectCode, section, markType, marksArray, classCode } = req.body;

    // If client sent classCode, try parsing it into subjectCode and section by
    // attempting splits and checking Subject existence (same strategy as
    // getClassStudents).
    if (!subjectCode && classCode) {
      if (typeof classCode !== 'string') {
        return res.status(400).json({ message: 'Invalid classCode' });
      }

      const dashIndices = [];
      for (let i = 0; i < classCode.length; i++) {
        if (classCode[i] === '-') dashIndices.push(i);
      }

      for (const idx of dashIndices) {
        const candidateSub = classCode.slice(0, idx);
        const candidateSection = classCode.slice(idx + 1);
        // eslint-disable-next-line no-await-in-loop
        const found = await Subject.findOne({ code: candidateSub });
        if (found) {
          subjectCode = candidateSub;
          section = candidateSection;
          break;
        }
      }

      if (!subjectCode) {
        return res.status(400).json({ message: 'Unable to parse classCode or subject not found' });
      }
    }

    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    const subject = await Subject.findOne({ code: subjectCode });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    // Verify faculty authorization
    const assignment = await FacultyAssignment.findOne({
      faculty: faculty._id,
      subject: subject._id,
      sections: { $in: [section] }
    });

    if (!assignment) {
      return res.status(403).json({ message: 'Not authorized for this subject/section' });
    }

    const updatePromises = marksArray.map(async (markData) => {
      const student = await Student.findOne({ rollNo: markData.rollNo });
      if (!student) throw new Error(`Student ${markData.rollNo} not found`);

      let marks = await Marks.findOne({
        student: student._id,
        subject: subject._id,
        faculty: faculty._id
      });

      if (!marks) {
        marks = new Marks({
          student: student._id,
          subject: subject._id,
          faculty: faculty._id,
          semester: subject.semester,
          section: section,
          enteredBy: req.user.id
        });
      }

      // Add marks based on type
      switch (markType) {
        case 'sliptest1':
          marks.slipTest1 = markData.marks;
          break;
        case 'sliptest2':
          marks.slipTest2 = markData.marks;
          break;
        case 'sliptest3':
          marks.slipTest3 = markData.marks;
          break;
        case 'assignment1':
          marks.assignment1 = markData.marks;
          break;
        case 'assignment2':
          marks.assignment2 = markData.marks;
          break;
        case 'classtest1':
          marks.classTest1 = markData.marks;
          break;
        case 'classtest2':
          marks.classTest2 = markData.marks;
          break;
        case 'attendance':
          marks.attendance = markData.marks;
          break;
        case 'weeklycie1':
          marks.weeklyCIE1 = markData.marks;
          break;
        case 'weeklycie2':
          marks.weeklyCIE2 = markData.marks;
          break;
        case 'weeklycie3':
          marks.weeklyCIE3 = markData.marks;
          break;
        case 'weeklycie4':
          marks.weeklyCIE4 = markData.marks;
          break;
        case 'weeklycie5':
          marks.weeklyCIE5 = markData.marks;
          break;
        case 'weeklycie6':
          marks.weeklyCIE6 = markData.marks;
          break;
        case 'weeklycie7':
          marks.weeklyCIE7 = markData.marks;
          break;
        case 'weeklycie8':
          marks.weeklyCIE8 = markData.marks;
          break;
        case 'weeklycie9':
          marks.weeklyCIE9 = markData.marks;
          break;
        case 'weeklycie10':
          marks.weeklyCIE10 = markData.marks;
          break;
        case 'internaltest1':
          marks.internalTest1 = markData.marks;
          break;
        case 'internaltest2':
          marks.internalTest2 = markData.marks;
          break;
        default:
          throw new Error(`Invalid mark type: ${markType}`);
      }

      marks.lastUpdated = new Date();
      return marks.save();
    });

    await Promise.all(updatePromises);

    res.json({
      message: 'Bulk marks update successful',
      updated: marksArray.length,
      markType,
      section,
      subject: subjectCode,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Bulk update marks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export const getAvailableSubjects = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Get all subjects in faculty's department that have been added by admin
    const departmentSubjects = await Subject.find({ department: faculty.department });

    // Get all faculty assignments for subjects in this department
    const allAssignments = await FacultyAssignment.find({
      subject: { $in: departmentSubjects.map(s => s._id) }
    });

    // Get subjects already assigned to this faculty
    const facultyAssignments = allAssignments.filter(assignment =>
      assignment.faculty.toString() === faculty._id.toString()
    );
    const assignedSubjectIds = facultyAssignments.map(assignment => assignment.subject.toString());

    // Filter out subjects already assigned to this faculty
    const availableSubjects = departmentSubjects.filter(subject =>
      !assignedSubjectIds.includes(subject._id.toString())
    );

    res.json({
      subjects: availableSubjects.map(subject => ({
        _id: subject._id,
        subjectCode: subject.code,
        subjectName: subject.name,
        classCode: subject.code, // Will be combined with section when assigned
        credits: subject.credits,
        type: subject.type,
        semester: subject.semester
      }))
    });
  } catch (error) {
    console.error('Get available subjects error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export const assignSubjectToFaculty = async (req, res) => {
  try {
    const { subjectId, sections, semester, academicYear } = req.body;

    if (!subjectId || !sections || !semester || !academicYear) {
      return res.status(400).json({
        message: 'subjectId, sections, semester, and academicYear are required'
      });
    }

    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Verify subject is in faculty's department
    if (subject.department.toString() !== faculty.department.toString()) {
      return res.status(403).json({ message: 'Subject not in faculty department' });
    }

    // Check if faculty is already assigned to this subject
    const existingAssignment = await FacultyAssignment.findOne({
      faculty: faculty._id,
      subject: subject._id,
      semester: semester
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: 'Faculty is already assigned to this subject for the given semester'
      });
    }

    // Create new assignment
    const assignment = new FacultyAssignment({
      faculty: faculty._id,
      subject: subject._id,
      sections: Array.isArray(sections) ? sections : [sections],
      semester: semester,
      academicYear: academicYear
    });

    await assignment.save();

    res.json({
      message: 'Subject assigned successfully',
      assignment: {
        subject: {
          code: subject.code,
          name: subject.name,
          credits: subject.credits,
          type: subject.type
        },
        sections: assignment.sections,
        semester: assignment.semester,
        academicYear: assignment.academicYear
      }
    });
  } catch (error) {
    console.error('Assign subject to faculty error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export const removeSubjectFromFaculty = async (req, res) => {
  try {
    const { subjectId } = req.params;

    if (!subjectId || subjectId === 'undefined') {
      return res.status(400).json({ message: 'subjectId is required and must be valid' });
    }

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: 'Invalid subjectId format' });
    }

    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Find and delete the assignment
    const assignment = await FacultyAssignment.findOneAndDelete({
      faculty: faculty._id,
      subject: subjectId
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Subject assignment not found' });
    }

    // Optionally, you might want to delete related marks or enrollments
    // But for now, we'll just remove the assignment

    res.json({
      message: 'Subject removed successfully',
      removedAssignment: {
        subjectId: assignment.subject,
        sections: assignment.sections,
        semester: assignment.semester,
        academicYear: assignment.academicYear
      }
    });
  } catch (error) {
    console.error('Remove subject from faculty error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export const uploadExcelMarks = async (req, res) => {
  try {
    const { classCode, markType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!classCode || !markType) {
      return res.status(400).json({ message: 'classCode and markType are required' });
    }

    // Parse classCode to get subjectCode and section
    let subjectCode = null;
    let section = null;

    if (typeof classCode !== 'string') {
      return res.status(400).json({ message: 'Invalid classCode' });
    }

    const dashIndices = [];
    for (let i = 0; i < classCode.length; i++) {
      if (classCode[i] === '-') dashIndices.push(i);
    }

    for (const idx of dashIndices) {
      const candidateSub = classCode.slice(0, idx);
      const candidateSection = classCode.slice(idx + 1);
      // eslint-disable-next-line no-await-in-loop
      const found = await Subject.findOne({ code: candidateSub });
      if (found) {
        subjectCode = candidateSub;
        section = candidateSection;
        break;
      }
    }

    if (!subjectCode) {
      return res.status(400).json({ message: 'Unable to parse classCode or subject not found' });
    }

    // Verify faculty authorization
    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    const subject = await Subject.findOne({ code: subjectCode });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const assignment = await FacultyAssignment.findOne({
      faculty: faculty._id,
      subject: subject._id,
      sections: { $in: [section] }
    });

    if (!assignment) {
      return res.status(403).json({ message: 'Not authorized for this subject/section' });
    }

    // Read Excel file
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Validate Excel structure
    if (jsonData.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty' });
    }

    // Check if required columns exist (Roll No and Marks)
    const firstRow = jsonData[0];
    const hasRollNo = Object.keys(firstRow).some(key =>
      key.toLowerCase().includes('roll') && key.toLowerCase().includes('no')
    );
    const hasMarks = Object.keys(firstRow).some(key =>
      key.toLowerCase().includes('mark')
    );

    if (!hasRollNo || !hasMarks) {
      return res.status(400).json({
        message: 'Excel file must contain columns with "Roll No" and "Marks" in the header'
      });
    }

    // Process the data
    const marksArray = [];
    const errors = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNumber = i + 2; // +2 because Excel rows start at 1 and we have header

      // Find roll no and marks columns
      let rollNo = null;
      let marks = null;

      for (const [key, value] of Object.entries(row)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('roll') && lowerKey.includes('no')) {
          rollNo = String(value).trim();
        } else if (lowerKey.includes('mark')) {
          marks = value;
        }
      }

      if (!rollNo) {
        errors.push(`Row ${rowNumber}: Roll No is missing`);
        continue;
      }

      if (marks === null || marks === undefined || marks === '') {
        errors.push(`Row ${rowNumber}: Marks is missing for Roll No ${rollNo}`);
        continue;
      }

      const marksValue = parseFloat(marks);
      if (isNaN(marksValue)) {
        errors.push(`Row ${rowNumber}: Invalid marks value for Roll No ${rollNo}`);
        continue;
      }

      marksArray.push({
        rollNo,
        marks: marksValue
      });
    }

    if (marksArray.length === 0) {
      return res.status(400).json({ message: 'No valid marks data found in Excel file' });
    }

    // Update marks in database
    const updatePromises = marksArray.map(async (markData) => {
      const student = await Student.findOne({ rollNo: markData.rollNo });
      if (!student) {
        errors.push(`Student with Roll No ${markData.rollNo} not found`);
        return;
      }

      let marks = await Marks.findOne({
        student: student._id,
        subject: subject._id,
        faculty: faculty._id
      });

      if (!marks) {
        marks = new Marks({
          student: student._id,
          subject: subject._id,
          faculty: faculty._id,
          semester: subject.semester,
          section: section,
          enteredBy: req.user.id
        });
      }

      // Set marks based on markType
      switch (markType.toLowerCase()) {
        case 'sliptest1':
          marks.slipTest1 = markData.marks;
          break;
        case 'sliptest2':
          marks.slipTest2 = markData.marks;
          break;
        case 'sliptest3':
          marks.slipTest3 = markData.marks;
          break;
        case 'assignment1':
          marks.assignment1 = markData.marks;
          break;
        case 'assignment2':
          marks.assignment2 = markData.marks;
          break;
        case 'classtest1':
          marks.classTest1 = markData.marks;
          break;
        case 'classtest2':
          marks.classTest2 = markData.marks;
          break;
        case 'attendance':
          marks.attendance = markData.marks;
          break;
        case 'weeklycie1':
          marks.weeklyCIE1 = markData.marks;
          break;
        case 'weeklycie2':
          marks.weeklyCIE2 = markData.marks;
          break;
        case 'weeklycie3':
          marks.weeklyCIE3 = markData.marks;
          break;
        case 'weeklycie4':
          marks.weeklyCIE4 = markData.marks;
          break;
        case 'weeklycie5':
          marks.weeklyCIE5 = markData.marks;
          break;
        case 'weeklycie6':
          marks.weeklyCIE6 = markData.marks;
          break;
        case 'weeklycie7':
          marks.weeklyCIE7 = markData.marks;
          break;
        case 'weeklycie8':
          marks.weeklyCIE8 = markData.marks;
          break;
        case 'weeklycie9':
          marks.weeklyCIE9 = markData.marks;
          break;
        case 'weeklycie10':
          marks.weeklyCIE10 = markData.marks;
          break;
        case 'internaltest1':
          marks.internalTest1 = markData.marks;
          break;
        case 'internaltest2':
          marks.internalTest2 = markData.marks;
          break;
        default:
          errors.push(`Invalid mark type: ${markType}`);
          return;
      }

      marks.lastUpdated = new Date();
      return marks.save();
    });

    await Promise.all(updatePromises);

    // Clean up uploaded file
    fs.unlinkSync(file.path);

    res.json({
      message: 'Excel marks uploaded successfully',
      processed: marksArray.length,
      errors: errors.length > 0 ? errors : undefined,
      markType,
      section,
      subject: subjectCode,
      updatedAt: new Date()
    });

  } catch (error) {
    console.error('Upload Excel marks error:', error);

    // Clean up file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Export multer upload middleware
export { upload };
