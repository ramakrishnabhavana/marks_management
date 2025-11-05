import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Faculty from '../models/Faculty.js';

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marks_management');
    console.log('Connected to MongoDB');

    // Remove any existing test user
    await User.findOneAndDelete({ username: 'test.faculty' });
    
    // Create a new password hash
    const password = 'test123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username: 'test.faculty',
      password: hashedPassword,
      email: 'test.faculty@test.com',
      name: 'Test Faculty',
      role: 'faculty'
    });

    // Create faculty profile
    await Faculty.create({
      user: user._id,
      name: 'Test Faculty',
      email: 'test.faculty@test.com',
      department: 'Information Technology',
      designation: 'Assistant Professor'
    });

    console.log('\nTest user created successfully:');
    console.log('Username: test.faculty');
    console.log('Password: test123');
    console.log('Role: faculty');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

createTestUser();