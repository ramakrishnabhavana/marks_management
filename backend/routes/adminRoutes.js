import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  addSubjectToDepartment,
  getDepartmentSubjects,
  addFacultyToDepartment,
  getDepartmentFaculty,
  addClassToDepartment,
  getDepartmentClasses,
  addStudentsToClass,
  createStudentAndAddToClass,
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

// Faculty routes within departments
router.post('/departments/:departmentId/faculty', addFacultyToDepartment);
router.get('/departments/:departmentId/faculty', getDepartmentFaculty);

// Class/Section routes within departments
router.post('/departments/:departmentId/classes', addClassToDepartment);
router.get('/departments/:departmentId/classes', getDepartmentClasses);
router.post('/departments/:departmentId/classes/:classId/students', addStudentsToClass);
router.post('/departments/:departmentId/classes/:classId/create-student', createStudentAndAddToClass);

export default router;
