import { Student } from '../models/student.model.js';
import { Enrollment } from '../models/enrollments.model.js';
import { Subject } from '../models/subject.model.js';
import { StudentMarksHybrid } from '../models/studentmarks.hybrid.model.js';

// Get student's enrolled subjects (classes)
export const getSubjects = async (req, res) => {
  try {
    // Find student by user ID
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Get all enrollments for this student
    const enrollments = await Enrollment.find({ student: student._id })
      .populate('subject')
      .populate('faculty');

    // Format subjects data
    const subjects = enrollments.map(enrollment => ({
      courseCode: enrollment.subject.code,
      name: enrollment.subject.name,
      type: enrollment.subject.isElective ? 'elective' : 'theory', // Use isElective field
      credits: enrollment.subject.credits,
      maxCIE: 40, // Standard CIE max, can be configured
      classCode: `${enrollment.subject.code}-${student.section}`, // Format classCode
      className: enrollment.subject.name,
      facultyName: enrollment.faculty?.name || 'TBD'
    }));

    res.json({ subjects });
  } catch (err) {
    console.error('getSubjects error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student's marks for a specific subject
export const getSubjectMarks = async (req, res) => {
  try {
    const { classCode } = req.params;

    // Find student by user ID
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Parse classCode to get subject code
    const [subjectCode] = classCode.split('-');

    // Verify student is enrolled in this subject
    const subject = await Subject.findOne({ code: subjectCode });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const enrollment = await Enrollment.findOne({
      student: student._id,
      subject: subject._id
    });
    if (!enrollment) return res.status(404).json({ message: 'Subject not found or not enrolled' });

    // Get student's marks for this class
    const marksDoc = await StudentMarksHybrid.findOne({
      classCode,
      rollNo: student.roll
    });

    if (!marksDoc) {
      // Return empty marks structure if no marks entered yet
      res.json({
        marks: {
          slipTests: [],
          assignments: [],
          classTests: [],
          attendance: 0,
          weeklyCIE: [],
          internalTests: []
        }
      });
      return;
    }

    // Format marks to match frontend expectations
    const formattedMarks = {
      slipTests: marksDoc.slipTests || [],
      assignments: marksDoc.assignments || [],
      classTests: marksDoc.classTests || [], // Map mids to classTests for frontend compatibility
      attendance: marksDoc.attendanceMarks || 0,
      weeklyCIE: [], // For lab subjects, can be enhanced later
      internalTests: []
    };

    res.json({ marks: formattedMarks });
  } catch (err) {
    console.error('getSubjectMarks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
