import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Subject from '../models/Subject.js';
import Enrollment from '../models/Enrollment.js';
import FacultyAssignment from '../models/FacultyAssignment.js';

dotenv.config();

const seedCollegeData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Subject.deleteMany({});
    await Enrollment.deleteMany({});
    await FacultyAssignment.deleteMany({});

    // Create Faculty Users
    const facultyUsers = await User.create([
      {
        username: 'rama.lakshmi',
        password: 'password123',
        name: 'Dr. E. Rama Lakshmi',
        role: 'faculty'
      },
      {
        username: 'suresh.kumar',
        password: 'password123',
        name: 'Dr. Suresh Kumar',
        role: 'faculty'
      },
      {
        username: 'priya.sharma',
        password: 'password123',
        name: 'Dr. Priya Sharma',
        role: 'faculty'
      },
      {
        username: 'anil.verma',
        password: 'password123',
        name: 'Dr. Anil Verma',
        role: 'faculty'
      },
      {
        username: 'meera.patel',
        password: 'password123',
        name: 'Dr. Meera Patel',
        role: 'faculty'
      }
    ]);

    // Create Faculty Profiles
    const faculties = await Faculty.create([
      {
        user: facultyUsers[0]._id,
        name: 'E. Rama Lakshmi',
        email: 'rama.lakshmi@college.edu',
        department: 'Computer Science',
        designation: 'Professor'
      },
      {
        user: facultyUsers[1]._id,
        name: 'Suresh Kumar',
        email: 'suresh.kumar@college.edu',
        department: 'Information Technology',
        designation: 'Associate Professor'
      },
      {
        user: facultyUsers[2]._id,
        name: 'Priya Sharma',
        email: 'priya.sharma@college.edu',
        department: 'Computer Science',
        designation: 'Assistant Professor'
      },
      {
        user: facultyUsers[3]._id,
        name: 'Anil Verma',
        email: 'anil.verma@college.edu',
        department: 'Information Technology',
        designation: 'Professor'
      },
      {
        user: facultyUsers[4]._id,
        name: 'Meera Patel',
        email: 'meera.patel@college.edu',
        department: 'Computer Science',
        designation: 'Associate Professor'
      }
    ]);

    // Create Student Users
    const studentUsers = await User.create([
      {
        username: '22CSE001',
        password: 'password123',
        name: 'Alice Johnson',
        role: 'student'
      },
      {
        username: '22CSE002',
        password: 'password123',
        name: 'Bob Smith',
        role: 'student'
      },
      {
        username: '22CSE003',
        password: 'password123',
        name: 'Carol Davis',
        role: 'student'
      },
      {
        username: '22ITE001',
        password: 'password123',
        name: 'David Wilson',
        role: 'student'
      },
      {
        username: '22ITE002',
        password: 'password123',
        name: 'Eva Brown',
        role: 'student'
      }
    ]);

    // Create Student Profiles
    const students = await Student.create([
      {
        user: studentUsers[0]._id,
        rollNo: '22CSE001',
        name: 'Alice Johnson',
        section: 'CSE-A',
        year: 3,
        semester: 6,
        department: 'Computer Science',
        mentor: faculties[0]._id
      },
      {
        user: studentUsers[1]._id,
        rollNo: '22CSE002',
        name: 'Bob Smith',
        section: 'CSE-A',
        year: 3,
        semester: 6,
        department: 'Computer Science',
        mentor: faculties[0]._id
      },
      {
        user: studentUsers[2]._id,
        rollNo: '22CSE003',
        name: 'Carol Davis',
        section: 'CSE-B',
        year: 3,
        semester: 6,
        department: 'Computer Science',
        mentor: faculties[0]._id
      },
      {
        user: studentUsers[3]._id,
        rollNo: '22ITE001',
        name: 'David Wilson',
        section: 'IT-A',
        year: 3,
        semester: 6,
        department: 'Information Technology',
        mentor: faculties[1]._id
      },
      {
        user: studentUsers[4]._id,
        rollNo: '22ITE002',
        name: 'Eva Brown',
        section: 'IT-A',
        year: 3,
        semester: 6,
        department: 'Information Technology',
        mentor: faculties[1]._id
      }
    ]);

    // Create Theory Subjects
    const theorySubjects = await Subject.create([
      {
        code: '22CSC21',
        name: 'Software Engineering',
        credits: 3,
        type: 'theory',
        semester: 6,
        department: 'Computer Science'
      },
      {
        code: '22ITC08',
        name: 'Enterprise Application Development',
        credits: 3,
        type: 'theory',
        semester: 6,
        department: 'Information Technology'
      },
      {
        code: '22CAC17',
        name: 'Machine Learning',
        credits: 3,
        type: 'theory',
        semester: 6,
        department: 'Computer Science'
      },
      {
        code: '22ITC10',
        name: 'Computer Networks',
        credits: 3,
        type: 'theory',
        semester: 6,
        department: 'Information Technology'
      },
      {
        code: '22ITC12',
        name: 'Formal Languages and Automata Theory',
        credits: 3,
        type: 'theory',
        semester: 6,
        department: 'Information Technology'
      },
      {
        code: '22CIE55',
        name: 'Cyber Security',
        credits: 3,
        type: 'theory',
        semester: 6,
        department: 'Computer Science'
      },
      {
        code: '22ITE06',
        name: 'Software Project Management',
        credits: 3,
        type: 'theory',
        semester: 6,
        department: 'Information Technology'
      }
    ]);

    // Create Lab Subjects
    const labSubjects = await Subject.create([
      {
        code: '22CSC23',
        name: 'CASE Tools Lab',
        credits: 1,
        type: 'lab',
        semester: 6,
        department: 'Computer Science'
      },
      {
        code: '22ITC09',
        name: 'Enterprise Application Development Lab',
        credits: 1,
        type: 'lab',
        semester: 6,
        department: 'Information Technology'
      },
      {
        code: '22ITC11',
        name: 'Computer Networks Lab',
        credits: 1,
        type: 'lab',
        semester: 6,
        department: 'Information Technology'
      },
      {
        code: '22CAC18',
        name: 'Machine Learning Lab',
        credits: 1,
        type: 'lab',
        semester: 6,
        department: 'Computer Science'
      },
      {
        code: '22ITC16',
        name: 'Competitive Coding',
        credits: 1,
        type: 'lab',
        semester: 6,
        department: 'Information Technology'
      }
    ]);

    // Faculty Assignments for Theory Subjects
    await FacultyAssignment.create([
      {
        faculty: faculties[0]._id,
        subject: theorySubjects[0]._id, // Software Engineering
        sections: ['CSE-A', 'CSE-B'],
        semester: 6,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[1]._id,
        subject: theorySubjects[1]._id, // Enterprise Application Development
        sections: ['CSE-A', 'CSE-B', 'IT-A'],
        semester: 6,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[2]._id,
        subject: theorySubjects[2]._id, // Machine Learning
        sections: ['CSE-A', 'CSE-B'],
        semester: 6,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[3]._id,
        subject: theorySubjects[3]._id, // Computer Networks
        sections: ['CSE-A', 'CSE-B', 'IT-A'],
        semester: 6,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[4]._id,
        subject: theorySubjects[4]._id, // Formal Languages
        sections: ['CSE-A', 'CSE-B', 'IT-A'],
        semester: 6,
        academicYear: '2024-25'
      }
    ]);

    // Faculty Assignments for Lab Subjects
    await FacultyAssignment.create([
      {
        faculty: faculties[0]._id,
        subject: labSubjects[0]._id, // CASE Tools Lab
        sections: ['CSE-A', 'CSE-B'],
        semester: 6,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[1]._id,
        subject: labSubjects[1]._id, // EAD Lab
        sections: ['CSE-A', 'CSE-B', 'IT-A'],
        semester: 6,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[3]._id,
        subject: labSubjects[2]._id, // CN Lab
        sections: ['CSE-A', 'CSE-B', 'IT-A'],
        semester: 6,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[2]._id,
        subject: labSubjects[3]._id, // ML Lab
        sections: ['CSE-A', 'CSE-B'],
        semester: 6,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[4]._id,
        subject: labSubjects[4]._id, // Competitive Coding
        sections: ['CSE-A', 'CSE-B', 'IT-A'],
        semester: 6,
        academicYear: '2024-25'
      }
    ]);

    // Enroll CSE-A Students in Subjects
    const cseAStudents = students.filter(s => s.section === 'CSE-A');
    for (const student of cseAStudents) {
      // Theory Subjects
      await Enrollment.create([
        {
          student: student._id,
          subject: theorySubjects[0]._id, // Software Engineering
          faculty: faculties[0]._id,
          section: 'CSE-A',
          semester: 6
        },
        {
          student: student._id,
          subject: theorySubjects[1]._id, // Enterprise Application Development
          faculty: faculties[1]._id,
          section: 'CSE-A',
          semester: 6
        },
        {
          student: student._id,
          subject: theorySubjects[2]._id, // Machine Learning
          faculty: faculties[2]._id,
          section: 'CSE-A',
          semester: 6
        },
        {
          student: student._id,
          subject: theorySubjects[3]._id, // Computer Networks
          faculty: faculties[3]._id,
          section: 'CSE-A',
          semester: 6
        },
        {
          student: student._id,
          subject: theorySubjects[4]._id, // Formal Languages
          faculty: faculties[4]._id,
          section: 'CSE-A',
          semester: 6
        },
        {
          student: student._id,
          subject: theorySubjects[5]._id, // Cyber Security (Elective)
          faculty: faculties[0]._id,
          section: 'CSE-A',
          semester: 6,
          chosenAsElective: true,
          electiveGroup: 'Professional Elective - 2'
        }
      ]);

      // Lab Subjects
      await Enrollment.create([
        {
          student: student._id,
          subject: labSubjects[0]._id, // CASE Tools Lab
          faculty: faculties[0]._id,
          section: 'CSE-A',
          semester: 6
        },
        {
          student: student._id,
          subject: labSubjects[1]._id, // EAD Lab
          faculty: faculties[1]._id,
          section: 'CSE-A',
          semester: 6
        },
        {
          student: student._id,
          subject: labSubjects[2]._id, // CN Lab
          faculty: faculties[3]._id,
          section: 'CSE-A',
          semester: 6
        },
        {
          student: student._id,
          subject: labSubjects[3]._id, // ML Lab
          faculty: faculties[2]._id,
          section: 'CSE-A',
          semester: 6
        },
        {
          student: student._id,
          subject: labSubjects[4]._id, // Competitive Coding
          faculty: faculties[4]._id,
          section: 'CSE-A',
          semester: 6
        }
      ]);
    }

    console.log('College data created successfully!');
    console.log('\n=== Login Credentials ===');
    console.log('Faculty:');
    console.log('Username: rama.lakshmi');
    console.log('Password: password123');
    console.log('\nStudent:');
    console.log('Username: 22CSE001');
    console.log('Password: password123');
    console.log('\n========================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding college data:', error);
    process.exit(1);
  }
};

seedCollegeData();
