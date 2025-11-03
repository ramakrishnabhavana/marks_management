import express from 'express';
import { auth, authorize } from '../middleware/auth.js';
import {
  getStudentProfile,
  getStudentMarksBySubject
} from '../controllers/studentController.js';

const router = express.Router();

router.use(auth);
router.use(authorize('student'));

router.get('/profile', getStudentProfile);
router.get('/marks/:subjectCode', getStudentMarksBySubject);

export default router;
