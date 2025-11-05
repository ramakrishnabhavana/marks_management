import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Faculty from '../models/Faculty.js';

dotenv.config();

const resetUsers = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/marks_management';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    await Faculty.deleteMany({});
    console.log('Cleared existing users');

    // Create a test faculty user
    const password = await bcrypt.hash('password123', 10);
    
    const user = await User.create({
      username: 'e.rama.lakshmi',
      name: 'Mrs. E. Rama Lakshmi',
      password: password,
      role: 'faculty',
      email: 'e.rama.lakshmi@cbit.ac.in'
    });

    await Faculty.create({
      user: user._id,
      name: 'Mrs. E. Rama Lakshmi',
      email: 'e.rama.lakshmi@cbit.ac.in',
      department: 'Information Technology',
      designation: 'Assistant Professor'
    });

    // Also create a test student
    const studentUser = await User.create({
      username: '160123737164',
      name: 'SISTLA KEERTHANA',
      password: password,
      role: 'student'
    });

    console.log('\nTest accounts created:');
    console.log('\nFaculty:');
    console.log('Username: e.rama.lakshmi');
    console.log('Password: password123');
    console.log('\nStudent:');
    console.log('Username: 160123737164');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

resetUsers();