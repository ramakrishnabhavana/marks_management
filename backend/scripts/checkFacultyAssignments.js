import mongoose from 'mongoose';
import Faculty from '../models/Faculty.js';
import Subject from '../models/Subject.js';
import FacultyAssignment from '../models/FacultyAssignment.js';

const checkAssignments = async () => {
  try {
    // Clear any existing connections
    await mongoose.connection.close();
    
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marks_management');
    console.log('Connected to MongoDB');

    // Find U. Sai Ram's faculty profile
    const faculty = await Faculty.findOne({ name: { $regex: 'U. Sai Ram', $options: 'i' } });
    if (!faculty) {
      console.log('Faculty not found');
      return;
    }

    console.log('Found faculty:', faculty.name, faculty._id);

    // Find all assignments for U. Sai Ram
    const assignments = await FacultyAssignment.find({ faculty: faculty._id })
      .populate('subject', 'code name type');
    
    console.log('Total assignments found:', assignments.length);

    console.log('\nAssignments for Mr. U. Sai Ram:');
    assignments.forEach(assignment => {
      console.log(`\nSubject: ${assignment.subject.name} (${assignment.subject.code})`);
      console.log(`Type: ${assignment.subject.type}`);
      console.log(`Sections: ${assignment.sections.join(', ')}`);
      console.log(`Academic Year: ${assignment.academicYear}`);
      if (assignment.electiveSection) {
        console.log(`Elective Section: ${assignment.electiveSection}`);
      }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkAssignments();