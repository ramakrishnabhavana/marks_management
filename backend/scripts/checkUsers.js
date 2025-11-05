import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Faculty from '../models/Faculty.js';

dotenv.config();

const checkUsers = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/marks_management';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const userCount = await User.countDocuments();
    console.log(`\nTotal users in database: ${userCount}`);

    // List some faculty users
    console.log('\nFaculty Users:');
    const facultyUsers = await User.find({ role: 'faculty' }).limit(5);
    facultyUsers.forEach(user => {
      console.log(`Username: ${user.username}, Name: ${user.name}, Role: ${user.role}`);
    });

    // List some student users
    console.log('\nStudent Users:');
    const studentUsers = await User.find({ role: 'student' }).limit(5);
    studentUsers.forEach(user => {
      console.log(`Username: ${user.username}, Name: ${user.name}, Role: ${user.role}`);
    });

    // Check a specific faculty user
    const faculty = await User.findOne({ username: 'e.rama.lakshmi' });
    if (faculty) {
      console.log('\nFound e.rama.lakshmi:', faculty);
    } else {
      console.log('\ne.rama.lakshmi not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

checkUsers();