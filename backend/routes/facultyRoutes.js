import express from 'express';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/auth.js';
import {
  getFacultyProfile,
  getStudentsForSubject,
  updateStudentMarks,
  bulkUpdateMarks
} from '../controllers/facultyController.js';

const router = express.Router();

router.use(auth);
router.use(authorize('faculty'));

router.get('/profile', getFacultyProfile);
router.get('/subjects/:subjectCode/sections/:section/students', getStudentsForSubject);
router.post('/marks/update', updateStudentMarks);
router.post('/marks/bulk-update', bulkUpdateMarks);

export default router;
