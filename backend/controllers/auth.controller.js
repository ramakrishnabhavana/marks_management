import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { FacultyHybrid } from '../models/faculty.hybrid.model.js';
import { ClassHybrid } from '../models/class.hybrid.model.js';

const generateToken = (id, role, facultyId = null, rollNo = null) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');
  return jwt.sign({ id, role, facultyId, rollNo }, secret, { expiresIn: '7d' });
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, role });
    if (!user) {
      console.error('User not found:', { email, role });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.error('Password mismatch for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let additional = {};
    let facultyId = null;
    let rollNo = null;

    if (role === 'faculty') {
      // For faculty, we need to find their facultyId from FacultyHybrid collection
      // This assumes faculty email maps to facultyId, or we can enhance this mapping
      const faculty = await FacultyHybrid.findOne({ email: user.email });
      if (faculty) {
        facultyId = faculty.facultyId;
        additional = {
          facultyId: faculty.facultyId,
          department: faculty.department,
          classesCount: faculty.classesTaught.length
        };
      } else {
        console.error('Faculty record not found for user:', user.email);
        // Still allow login but without faculty data
      }
    } else if (role === 'student') {
      // For students, we need to find their rollNo from ClassHybrid collections
      // This is a simplified approach - in production, you might have a separate student mapping
      // For now, we'll assume rollNo is stored in user model or can be derived
      // This needs to be enhanced based on your actual data structure
      rollNo = user.rollNo || null; // Assuming rollNo is added to User model
      additional = { rollNo };
    }

    const token = generateToken(user._id.toString(), user.role, facultyId, rollNo);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...additional
      }
    });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
