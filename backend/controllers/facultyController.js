import { Faculty } from '../models/Faculty.js';
import { Subject } from '../models/Subject.js';
import { Marks } from '../models/Marks.js';
import { Student } from '../models/Student.js';
import { Enrollment } from '../models/Enrollment.js';
import { FacultyAssignment } from '../models/FacultyAssignment.js';

export const getFacultyProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user.id })
      .populate('timetable.Monday.subject')
      .populate('timetable.Tuesday.subject')
      .populate('timetable.Wednesday.subject')
      .populate('timetable.Thursday.subject')
      .populate('timetable.Friday.subject')
      .populate('timetable.Saturday.subject');

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Get assigned subjects with details
    const assignments = await FacultyAssignment.find({ faculty: faculty._id })
      .populate('subject', 'code name credits type');

    const subjectsWithDetails = await Promise.all(
      assignments.map(async (assignment) => {
        const subject = assignment.subject;
        const sections = assignment.sections;

        // Get student counts and marks summary for each section
        const sectionDetails = await Promise.all(
          sections.map(async (section) => {
            const studentCount = await Enrollment.countDocuments({
              subject: subject._id,
              section: section
            });

            const marksSummary = await Marks.aggregate([
              {
                $match: {
                  subject: subject._id,
                  section: section,
                  faculty: faculty._id
                }
              },
              {
                $group: {
                  _id: null,
                  totalStudents: { $sum: 1 },
                  averageMarks: { $avg: '$totalCieMarks' },
                  maxMarks: { $max: '$totalCieMarks' },
                  minMarks: { $min: '$totalCieMarks' },
                  passed: {
                    $sum: {
                      $cond: [{ $gte: ['$totalCieMarks', 24] }, 1, 0]
                    }
                  }
                }
              }
            ]);

            return {
              section,
              studentCount,
              summary: marksSummary[0] || {
                totalStudents: 0,
                averageMarks: 0,
                maxMarks: 0,
                minMarks: 0,
                passed: 0
              }
            };
          })
        );

        return {
          subject: {
            code: subject.code,
            name: subject.name,
            credits: subject.credits,
            type: subject.type
          },
          sections: sectionDetails,
          handlesLab: assignment.handlesLab,
          isElective: assignment.isElective
        };
      })
    );

    res.json({
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        mobile: faculty.mobile,
        department: faculty.department,
        designation: faculty.designation,
        qualifications: faculty.qualifications,
        workload: faculty.workload
      },
      timetable: faculty.timetable,
      assignedSubjects: subjectsWithDetails
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
      sections: section
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
        if (subject.type === 'theory') {
          const slipTestAvg = studentMarks.slipTests.length > 0 ?
            studentMarks.slipTests.reduce((a, b) => a + b.marks, 0) / studentMarks.slipTests.length : 0;

          const assignmentAvg = studentMarks.assignments.length > 0 ?
            studentMarks.assignments.reduce((a, b) => a + b.marks, 0) / studentMarks.assignments.length : 0;

          const internalTestAvg = studentMarks.internalTests.length > 0 ?
            studentMarks.internalTests.reduce((a, b) => a + b.marks, 0) / studentMarks.internalTests.length : 0;

          marksSummary = {
            slipTestAverage: parseFloat(slipTestAvg.toFixed(2)),
            assignmentAverage: parseFloat(assignmentAvg.toFixed(2)),
            internalTestAverage: parseFloat(internalTestAvg.toFixed(2)),
            attendanceMark: studentMarks.attendance?.marks || 0,
            totalMark: slipTestAvg + assignmentAvg + internalTestAvg + (studentMarks.attendance?.marks || 0)
          };
        }
      }

      return {
        student: enrollment.student,
        enrollment: {
          chosenAsElective: enrollment.chosenAsElective,
          electiveGroup: enrollment.electiveGroup
        },
        marks: studentMarks ? {
          slipTests: studentMarks.slipTests,
          assignments: studentMarks.assignments,
          internalTests: studentMarks.internalTests,
          labRecords: studentMarks.labRecords,
          labTests: studentMarks.labTests,
          attendance: studentMarks.attendance,
          ...marksSummary,
          grade: studentMarks.grade,
          remarks: studentMarks.remarks,
          lastUpdated: studentMarks.lastUpdated
        } : null
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
      sections: section || student.section
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
    switch (markType) {
      case 'slipTest':
        marks.slipTests.push({
          testNumber: marks.slipTests.length + 1,
          marks: marksData.marks,
          maxMarks: marksData.maxMarks || 5,
          date: new Date(),
          topic: marksData.topic || `Slip Test ${marks.slipTests.length + 1}`
        });
        break;

      case 'assignment':
        marks.assignments.push({
          assignmentNumber: marks.assignments.length + 1,
          marks: marksData.marks,
          maxMarks: marksData.maxMarks || 10,
          date: new Date(),
          topic: marksData.topic || `Assignment ${marks.assignments.length + 1}`
        });
        break;

      case 'internalTest':
        marks.internalTests.push({
          testNumber: marks.internalTests.length + 1,
          marks: marksData.marks,
          maxMarks: marksData.maxMarks || 20,
          date: new Date(),
          topic: marksData.topic || `Internal Test ${marks.internalTests.length + 1}`
        });
        break;

      case 'attendance':
        marks.attendance = {
          ...marks.attendance,
          ...marksData,
          lastUpdated: new Date()
        };
        break;

      case 'labRecord':
        marks.labRecords.push({
          experiment: marksData.experiment || `Experiment ${marks.labRecords.length + 1}`,
          marks: marksData.marks,
          maxMarks: marksData.maxMarks || 5,
          date: new Date()
        });
        break;

      case 'labTest':
        marks.labTests.push({
          testNumber: marks.labTests.length + 1,
          marks: marksData.marks,
          maxMarks: marksData.maxMarks || 10,
          date: new Date()
        });
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
    const { subjectCode, section, markType, marksArray } = req.body;

    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    const subject = await Subject.findOne({ code: subjectCode });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    // Verify faculty authorization
    const assignment = await FacultyAssignment.findOne({
      faculty: faculty._id,
      subject: subject._id,
      sections: section
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
        case 'slipTest':
          marks.slipTests.push({
            testNumber: marks.slipTests.length + 1,
            marks: markData.marks,
            maxMarks: 5,
            date: new Date(),
            topic: `Slip Test ${marks.slipTests.length + 1}`
          });
          break;

        case 'assignment':
          marks.assignments.push({
            assignmentNumber: marks.assignments.length + 1,
            marks: markData.marks,
            maxMarks: 10,
            date: new Date(),
            topic: `Assignment ${marks.assignments.length + 1}`
          });
          break;

        case 'internalTest':
          marks.internalTests.push({
            testNumber: marks.internalTests.length + 1,
            marks: markData.marks,
            maxMarks: 20,
            date: new Date(),
            topic: `Internal Test ${marks.internalTests.length + 1}`
          });
          break;

        case 'attendance':
          marks.attendance = {
            classesHeld: markData.classesHeld || marks.attendance?.classesHeld || 0,
            classesAttended: markData.classesAttended || marks.attendance?.classesAttended || 0,
            lastUpdated: new Date()
          };
          break;
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
