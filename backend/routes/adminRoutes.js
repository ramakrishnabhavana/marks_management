import express from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth.js';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  addSubjectToDepartment,
  getDepartmentSubjects,
  deleteSubjectFromDepartment,
  addFacultyToDepartment,
  getDepartmentFaculty,
  deleteFacultyFromDepartment,
  addClassToDepartment,
  getDepartmentClasses,
  addStudentsToClass,
  createStudentAndAddToClass,
  deleteStudentFromClass,
  bulkAddSubjects,
  bulkAddFaculty,
  bulkAddStudents,
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth);
router.use((req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
});

// Department routes
router.get('/departments', getDepartments);
router.post('/departments', createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

// Subject routes within departments
router.post('/departments/:departmentId/subjects', addSubjectToDepartment);
router.get('/departments/:departmentId/subjects', getDepartmentSubjects);
router.delete('/departments/:departmentId/subjects/:subjectId', deleteSubjectFromDepartment);

// Faculty routes within departments
router.post('/departments/:departmentId/faculty', addFacultyToDepartment);
router.get('/departments/:departmentId/faculty', getDepartmentFaculty);
router.delete('/departments/:departmentId/faculty/:facultyId', deleteFacultyFromDepartment);

// Class/Section routes within departments
router.post('/departments/:departmentId/classes', addClassToDepartment);
router.get('/departments/:departmentId/classes', getDepartmentClasses);
router.post('/departments/:departmentId/classes/:classId/students', addStudentsToClass);
router.post('/departments/:departmentId/classes/:classId/create-student', createStudentAndAddToClass);
router.delete('/departments/:departmentId/classes/:classId/students/:studentId', deleteStudentFromClass);

// Bulk upload routes
const upload = multer({ storage: multer.memoryStorage() });
router.post('/departments/:departmentId/subjects/bulk', upload.single('excelFile'), bulkAddSubjects);
router.post('/departments/:departmentId/faculty/bulk', upload.single('excelFile'), bulkAddFaculty);
router.post('/departments/:departmentId/classes/:classId/students/bulk', upload.single('excelFile'), bulkAddStudents);

export default router;
