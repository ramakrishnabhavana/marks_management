import express from 'express';
import { auth, authorize } from '../middleware/auth.js';
import {
  getFacultySubjects,
  getClassStudents,
  getFacultyProfile,
  updateStudentMarks,
  bulkUpdateMarks
} from '../controllers/facultyController.js';

const router = express.Router();

// Apply authentication and authorization middleware to all faculty routes
router.use(auth);
router.use(authorize('faculty'));

// Get faculty's assigned subjects
router.get('/subjects', getFacultySubjects);

// Get students in a specific class (subject + section)
router.get('/classes/:classCode/students', getClassStudents);

// Get faculty profile
router.get('/profile', getFacultyProfile);

// Update marks for a single student
router.put('/marks/update', updateStudentMarks);

// Bulk update marks for multiple students
router.post('/classes/:classCode/marks/bulk', bulkUpdateMarks);

export default router;