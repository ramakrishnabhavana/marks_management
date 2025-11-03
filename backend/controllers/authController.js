import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { Faculty } from '../models/Faculty.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username (roll number for students, email/name for faculty)
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let profile = {};

    if (user.role === 'student') {
      const student = await Student.findOne({ user: user._id })
        .populate('mentor', 'name email mobile');
      if (student) {
        profile = {
          id: student._id,
          rollNo: student.rollNo,
          name: student.name,
          section: student.section,
          year: student.year,
          semester: student.semester,
          department: student.department,
          mentor: student.mentor
        };
      }
    } else if (user.role === 'faculty') {
      const faculty = await Faculty.findOne({ user: user._id });
      if (faculty) {
        profile = {
          id: faculty._id,
          name: faculty.name,
          email: faculty.email,
          mobile: faculty.mobile,
          department: faculty.department,
          designation: faculty.designation
        };
      }
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        ...profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    let profile = {};

    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id })
        .populate('mentor', 'name email mobile');
      if (student) {
        profile = {
          id: student._id,
          rollNo: student.rollNo,
          name: student.name,
          section: student.section,
          year: student.year,
          semester: student.semester,
          department: student.department,
          mentor: student.mentor
        };
      }
    } else if (req.user.role === 'faculty') {
      const faculty = await Faculty.findOne({ user: req.user._id });
      if (faculty) {
        profile = {
          id: faculty._id,
          name: faculty.name,
          email: faculty.email,
          mobile: faculty.mobile,
          department: faculty.department,
          designation: faculty.designation
        };
      }
    }

    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        role: req.user.role,
        name: req.user.name,
        ...profile
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
