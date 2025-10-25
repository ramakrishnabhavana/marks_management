import express from 'express';
import * as facultyCtrl from '../controllers/faculty.controller.js';
import { auth, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All faculty routes require authentication and faculty role
router.use(auth);                 // ✅ replaced authMiddleware with auth
router.use(authorize('faculty')); // ✅ role-based authorization

// Get faculty's subjects (classes they teach)
router.get('/subjects', facultyCtrl.getFacultySubjects);

// Get students in a specific class
router.get('/classes/:classCode/students', facultyCtrl.getStudentsInSubject);

// Bulk upload marks for a class
router.post('/classes/:classCode/marks/bulk', facultyCtrl.bulkUploadMarks);

// Get aggregated faculty dashboard data
router.get('/dashboard', facultyCtrl.getFacultyDashboard);

// Handle unknown faculty routes with JSON error
router.use((req, res) => {
  res.status(404).json({ message: 'Faculty route not found' });
});

export default router;
