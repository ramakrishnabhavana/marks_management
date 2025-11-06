import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FacultyAssignment from '../models/FacultyAssignment.js';
import Enrollment from '../models/Enrollment.js';
import Faculty from '../models/Faculty.js';
import Subject from '../models/Subject.js';

dotenv.config();

const testAssignments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marks_management');

    console.log('=== TESTING FACULTY ASSIGNMENTS ===');

    // Test 1: Count total faculty assignments
    const totalAssignments = await FacultyAssignment.countDocuments();
    console.log(`Total Faculty Assignments: ${totalAssignments}`);

    // Test 2: Check assignments by section
    const sections = ['IT-1', 'IT-2', 'IT-3'];
    for (const section of sections) {
      const sectionAssignments = await FacultyAssignment.find({ sections: { $in: [section] } });
      console.log(`\n${section} Assignments (${sectionAssignments.length}):`);
      for (const assignment of sectionAssignments) {
        const faculty = await Faculty.findById(assignment.faculty);
        const subject = await Subject.findById(assignment.subject);
        console.log(`  - ${faculty.name}: ${subject.name} (${subject.code})`);
      }
    }

    // Test 3: Check enrollments
    console.log('\n=== TESTING STUDENT ENROLLMENTS ===');
    const totalEnrollments = await Enrollment.countDocuments();
    console.log(`Total Enrollments: ${totalEnrollments}`);

    // Check enrollments by section
    for (const section of sections) {
      const sectionEnrollments = await Enrollment.find({ section });
      console.log(`\n${section} Enrollments (${sectionEnrollments.length}):`);
      const subjectCounts = {};
      for (const enrollment of sectionEnrollments) {
        const subject = await Subject.findById(enrollment.subject);
        subjectCounts[subject.name] = (subjectCounts[subject.name] || 0) + 1;
      }
      for (const [subject, count] of Object.entries(subjectCounts)) {
        console.log(`  - ${subject}: ${count} students`);
      }
    }

    // Test 4: Verify elective enrollments
    console.log('\n=== TESTING ELECTIVE ENROLLMENTS ===');
    const electiveEnrollments = await Enrollment.find({ chosenAsElective: true });
    console.log(`Total Elective Enrollments: ${electiveEnrollments.length}`);

    const electiveSubjects = ['Cyber Security', 'Software Project Management', 'Competitive Coding'];
    for (const subjectName of electiveSubjects) {
      const subject = await Subject.findOne({ name: subjectName });
      if (subject) {
        const enrollments = await Enrollment.find({ subject: subject._id, chosenAsElective: true });
        console.log(`${subjectName}: ${enrollments.length} enrollments`);
      }
    }

    // Test 5: Check faculty assignment details
    console.log('\n=== FACULTY ASSIGNMENT DETAILS ===');
    const assignments = await FacultyAssignment.find().populate('faculty').populate('subject');
    for (const assignment of assignments) {
      console.log(`${assignment.faculty.name} - ${assignment.subject.name} (${assignment.sections.join(', ')})`);
    }

    console.log('\n=== TESTING COMPLETED SUCCESSFULLY ===');

    process.exit(0);
  } catch (error) {
    console.error('Error testing assignments:', error);
    process.exit(1);
  }
};

testAssignments();
