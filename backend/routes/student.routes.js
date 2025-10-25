import express from 'express';
import * as studentCtrl from '../controllers/student.controller.js';
import { auth, authorize } from '../middleware/auth.middleware.js';  // ✅ only this import

const router = express.Router();

// All student routes require authentication and student role
router.use(auth);                // ✅ use auth instead of authMiddleware
router.use(authorize('student')); // ✅ keeps your student-only access

// Get student's enrolled subjects
router.get('/subjects', studentCtrl.getSubjects);

// Get student's marks for a specific subject
router.get('/subjects/:classCode/marks', studentCtrl.getSubjectMarks);

export default router;
