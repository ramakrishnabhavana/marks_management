import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Student } from '../models/student.model.js';

const generateToken = (id, role, facultyId = null, rollNo = null) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');
  return jwt.sign({ id, role, facultyId, rollNo }, secret, { expiresIn: '7d' });
};

export const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Find user by username (roll number for students, name for faculty)
    const user = await User.findOne({ username, role });
    if (!user) {
      console.error('User not found:', { username, role });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password using bcrypt compare
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.error('Password mismatch for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let additional = {};
    let facultyId = null;
    let rollNo = null;

    if (role === 'faculty') {
      // Find faculty record
      const faculty = await Faculty.findOne({ user: user._id });
      if (faculty) {
        additional = {
          facultyId: faculty._id.toString(),
          name: faculty.name,
          email: faculty.email,
          mobile: faculty.mobile
        };
      }
    } else if (role === 'student') {
      // Find student record
      const student = await Student.findOne({ user: user._id });
      if (student) {
        rollNo = student.roll;
        additional = {
          rollNo: student.roll,
          section: student.section,
          year: student.year,
          mentor: student.mentor
        };
      }
    }

    const token = generateToken(user._id.toString(), user.role, facultyId, rollNo);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        ...additional
      }
    });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
