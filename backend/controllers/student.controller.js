import { ClassHybrid } from '../models/class.hybrid.model.js';
import { StudentMarksHybrid } from '../models/studentmarks.hybrid.model.js';

// Get student's enrolled subjects (classes)
export const getSubjects = async (req, res) => {
  try {
    // Find all classes where student is enrolled
    const classes = await ClassHybrid.find({
      'students.rollNo': req.user.rollNo
    });

    // Format subjects data
    const subjects = classes.map(classInfo => ({
      courseCode: classInfo.subjectCode,
      name: classInfo.subjectName,
      type: 'theory', // Default to theory, can be enhanced later
      credits: classInfo.credits,
      maxCIE: 40, // Standard CIE max, can be configured
      classCode: classInfo.classCode,
      className: classInfo.className
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

    // Verify student is enrolled in this class
    const classDetails = await ClassHybrid.findOne({
      classCode,
      'students.rollNo': req.user.rollNo
    });
    if (!classDetails) return res.status(404).json({ message: 'Subject not found or not enrolled' });

    // Get student's marks for this class
    const marksDoc = await StudentMarksHybrid.findOne({
      classCode,
      rollNo: req.user.rollNo
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
      slipTests: marksDoc.slipTests,
      assignments: marksDoc.assignments,
      classTests: marksDoc.mids, // Map mids to classTests for frontend compatibility
      attendance: marksDoc.attendanceMarks,
      weeklyCIE: [], // For lab subjects, can be enhanced later
      internalTests: []
    };

    res.json({ marks: formattedMarks });
  } catch (err) {
    console.error('getSubjectMarks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
