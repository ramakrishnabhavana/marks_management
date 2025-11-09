import mongoose from 'mongoose';
import Department from '../models/Department.js';
import Subject from '../models/Subject.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const clearData = async () => {
  try {
    await connectDB();

    console.log('Clearing all data...');

    await User.deleteMany({});
    console.log('Users cleared');

    await Student.deleteMany({});
    console.log('Students cleared');

    await Faculty.deleteMany({});
    console.log('Faculty cleared');

    await Subject.deleteMany({});
    console.log('Subjects cleared');

    await Department.deleteMany({});
    console.log('Departments cleared');

    console.log('All data cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  }
};

clearData();
