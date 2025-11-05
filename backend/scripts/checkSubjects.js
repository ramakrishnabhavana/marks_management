import mongoose from 'mongoose';
import Subject from '../models/Subject.js';

const checkSubjects = async () => {
  try {
    await mongoose.connection.close();
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marks_management');
    console.log('Connected to MongoDB');

    const subjects = await Subject.find({
      name: { $regex: 'Machine Learning', $options: 'i' }
    });

    console.log('\nMachine Learning Subjects:');
    subjects.forEach(subject => {
      console.log(`\nSubject: ${subject.name} (${subject.code})`);
      console.log(`Type: ${subject.type}`);
      console.log(`Credits: ${subject.credits}`);
      console.log(`Department: ${subject.department}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkSubjects();