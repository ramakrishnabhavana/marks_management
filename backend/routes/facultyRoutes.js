import express from 'express';
import { auth, authorize } from '../middleware/auth.js';
import {
  getFacultyProfile,
  getFacultySubjects,
  getClassStudents,
  getStudentsForSubject,
  updateStudentMarks,
  bulkUpdateMarks,
  uploadExcelMarks,
  upload,
  getAvailableSubjects,
  assignSubjectToFaculty
} from '../controllers/facultyController.js';

const router = express.Router();

router.use(auth);
router.use(authorize('faculty'));

router.get('/profile', getFacultyProfile);
router.get('/subjects', getFacultySubjects);
router.get('/subjects/available', getAvailableSubjects);
router.post('/subjects/assign', assignSubjectToFaculty);
router.get('/classes/:classCode/students', getClassStudents);
router.get('/subjects/:subjectCode/sections/:section/students', getStudentsForSubject);
router.post('/marks/update', updateStudentMarks);
router.post('/marks/bulk-update', bulkUpdateMarks);
router.post('/marks/upload-excel', upload.single('excelFile'), uploadExcelMarks);

export default router;
