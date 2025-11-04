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

const seedIT3rdYear = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marks_management');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Subject.deleteMany({});
    await Enrollment.deleteMany({});
    await FacultyAssignment.deleteMany({});

    // Create All Faculty Members
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
      },
      {
        username: 'gangadhar.sir',
        password: 'password123',
        name: 'Dr. Gangadhar',
        role: 'faculty'
      },
      {
        username: 'u.sairam',
        password: 'password123',
        name: 'Mr. U. Sai Ram',
        role: 'faculty'
      },
      {
        username: 'b.harishgoud',
        password: 'password123',
        name: 'Dr. B. Harish Goud',
        role: 'faculty'
      },
      {
        username: 'sai.venkat',
        password: 'password123',
        name: 'Mr. Sai Venkat',
        role: 'faculty'
      }
    ]);

    // Create Faculty Profiles
    const faculties = await Faculty.create([
      {
        user: facultyUsers[0]._id,
        name: 'Dr. E. Rama Lakshmi',
        email: 'rama.lakshmi@cbit.ac.in',
        department: 'Computer Science',
        designation: 'Professor'
      },
      {
        user: facultyUsers[1]._id,
        name: 'Dr. Suresh Kumar',
        email: 'suresh.kumar@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Associate Professor'
      },
      {
        user: facultyUsers[2]._id,
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@cbit.ac.in',
        department: 'Computer Science',
        designation: 'Assistant Professor'
      },
      {
        user: facultyUsers[3]._id,
        name: 'Dr. Anil Verma',
        email: 'anil.verma@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Professor'
      },
      {
        user: facultyUsers[4]._id,
        name: 'Dr. Meera Patel',
        email: 'meera.patel@cbit.ac.in',
        department: 'Computer Science',
        designation: 'Associate Professor'
      },
      {
        user: facultyUsers[5]._id,
        name: 'Dr. Gangadhar',
        email: 'gangadhar@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Professor'
      },
      {
        user: facultyUsers[6]._id,
        name: 'Mr. U. Sai Ram',
        email: 'u.sairam@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      },
      {
        user: facultyUsers[7]._id,
        name: 'Dr. B. Harish Goud',
        email: 'b.harishgoud@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Professor'
      },
      {
        user: facultyUsers[8]._id,
        name: 'Mr. Sai Venkat',
        email: 'sai.venkat@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      }
    ]);

    // Create All Subjects for 5th Semester IT
    const subjects = await Subject.create([
      // Core Theory Subjects
      {
        code: '22ITC08',
        name: 'Enterprise Application Development',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITC10',
        name: 'Computer Networks',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITC12',
        name: 'Formal Languages and Automata Theory',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },

      // Professional Electives
      {
        code: '22CIE55',
        name: 'Cyber Security',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITE04',
        name: 'Software Project Management',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITE06',
        name: 'Cloud Computing',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },

      // Lab Subjects
      {
        code: '22ITC09',
        name: 'Enterprise Application Development Lab',
        credits: 1,
        type: 'lab',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITC11',
        name: 'Computer Networks Lab',
        credits: 1,
        type: 'lab',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITC16',
        name: 'Competitive Coding',
        credits: 1,
        type: 'lab',
        semester: 5,
        department: 'Information Technology'
      },

      // Other Department Subjects (if any)
      {
        code: '22MAT11',
        name: 'Advanced Mathematics',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Mathematics'
      },
      {
        code: '22HUM01',
        name: 'Professional Ethics',
        credits: 2,
        type: 'theory',
        semester: 5,
        department: 'Humanities'
      }
    ]);

    // Generate 220 IT 3rd Year Students across 3 sections
    const sections = ['IT-1', 'IT-2', 'IT-3'];
    const allStudents = [];

    // Student name templates for realistic data
    const firstNames = ['Aarav', 'Aditi', 'Akshay', 'Ananya', 'Arjun', 'Bhavya', 'Chetan', 'Divya', 'Gautam', 'Isha',
                       'Karan', 'Kriti', 'Manish', 'Neha', 'Pooja', 'Rahul', 'Riya', 'Sahil', 'Sanjay', 'Tanvi',
                       'Vikram', 'Yash', 'Zoya', 'Abhishek', 'Anjali', 'Deepak', 'Kavya', 'Mohit', 'Priya', 'Rohan'];

    const lastNames = ['Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Malhotra', 'Jain', 'Mehta',
                      'Choudhary', 'Aggarwal', 'Bansal', 'Goyal', 'Saxena', 'Mishra', 'Tiwari', 'Yadav', 'Pandey', 'Dubey'];

    let studentCount = 1;

    for (const section of sections) {
      const studentsInSection = section === 'IT-3' ? 73 : 74; // 73 in IT-3, 74 in others to total 221

      for (let i = 1; i <= studentsInSection; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const rollNo = `160123737${studentCount.toString().padStart(3, '0')}`;

        const user = await User.create({
          username: rollNo,
          password: 'password123',
          name: `${firstName} ${lastName}`,
          role: 'student'
        });

        const student = await Student.create({
          user: user._id,
          rollNo: rollNo,
          name: `${firstName} ${lastName}`,
          section: section,
          year: 3,
          semester: 5,
          department: 'Information Technology',
          mentor: faculties[5]._id // Dr. Gangadhar as default mentor
        });

        allStudents.push(student);
        studentCount++;
      }
    }

    // Create Faculty Assignments
    await FacultyAssignment.create([
      // Core Subjects - All IT Sections
      {
        faculty: faculties[5]._id, // Dr. Gangadhar
        subject: subjects[0]._id, // Enterprise Application Development
        sections: ['IT-1', 'IT-2', 'IT-3'],
        semester: 5,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[5]._id, // Dr. Gangadhar
        subject: subjects[6]._id, // EAD Lab
        sections: ['IT-1', 'IT-2', 'IT-3'],
        semester: 5,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[1]._id, // Dr. Suresh Kumar
        subject: subjects[1]._id, // Computer Networks
        sections: ['IT-1', 'IT-2', 'IT-3'],
        semester: 5,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[1]._id, // Dr. Suresh Kumar
        subject: subjects[7]._id, // Computer Networks Lab
        sections: ['IT-1', 'IT-2', 'IT-3'],
        semester: 5,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[3]._id, // Dr. Anil Verma
        subject: subjects[2]._id, // Formal Languages and Automata Theory
        sections: ['IT-1', 'IT-2', 'IT-3'],
        semester: 5,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[3]._id, // Dr. Anil Verma
        subject: subjects[8]._id, // Competitive Coding
        sections: ['IT-1', 'IT-2', 'IT-3'],
        semester: 5,
        academicYear: '2024-25'
      },

      // Professional Electives - Split by sections
      // Cyber Security - Mr. U. Sai Ram (IT-1, IT-2)
      {
        faculty: faculties[6]._id, // Mr. U. Sai Ram
        subject: subjects[3]._id, // Cyber Security
        sections: ['IT-1', 'IT-2'],
        semester: 5,
        academicYear: '2024-25',
        electiveSection: 'CS_SECTION-I'
      },
      // Cyber Security - Dr. B. Harish Goud (IT-2, IT-3)
      {
        faculty: faculties[7]._id, // Dr. B. Harish Goud
        subject: subjects[3]._id, // Cyber Security
        sections: ['IT-2', 'IT-3'],
        semester: 5,
        academicYear: '2024-25',
        electiveSection: 'CS_SECTION-II'
      },
      // Software Project Management - Mr. Sai Venkat (All sections)
      {
        faculty: faculties[8]._id, // Mr. Sai Venkat
        subject: subjects[4]._id, // Software Project Management
        sections: ['IT-1', 'IT-2', 'IT-3'],
        semester: 5,
        academicYear: '2024-25',
        electiveSection: 'SPM_SECTION'
      },
      // Cloud Computing - Dr. Meera Patel (All sections)
      {
        faculty: faculties[4]._id, // Dr. Meera Patel
        subject: subjects[5]._id, // Cloud Computing
        sections: ['IT-1', 'IT-2', 'IT-3'],
        semester: 5,
        academicYear: '2024-25',
        electiveSection: 'CC_SECTION'
      },

      // Other Department Subjects
      {
        faculty: faculties[0]._id, // Dr. Rama Lakshmi
        subject: subjects[9]._id, // Advanced Mathematics
        sections: ['IT-1', 'IT-2', 'IT-3'],
        semester: 5,
        academicYear: '2024-25'
      },
      {
        faculty: faculties[2]._id, // Dr. Priya Sharma
        subject: subjects[10]._id, // Professional Ethics
        sections: ['IT-1', 'IT-2', 'IT-3'],
        semester: 5,
        academicYear: '2024-25'
      }
    ]);

    // Enroll Students in Subjects
    for (const student of allStudents) {
      const section = student.section;

      // Enroll in all core subjects
      const coreSubjects = [subjects[0], subjects[1], subjects[2], subjects[6], subjects[7], subjects[8], subjects[9], subjects[10]];
      for (const subject of coreSubjects) {
        const facultyAssignment = await FacultyAssignment.findOne({
          subject: subject._id,
          sections: { $in: [section] }
        });

        if (facultyAssignment) {
          await Enrollment.create({
            student: student._id,
            subject: subject._id,
            faculty: facultyAssignment.faculty,
            section: section,
            semester: 5,
            academicYear: '2024-25'
          });
        }
      }

      // Enroll in one professional elective based on section
      let electiveSubject;
      if (section === 'IT-1') {
        // IT-1 students take Cyber Security with Mr. U. Sai Ram
        electiveSubject = subjects[3];
      } else if (section === 'IT-2') {
        // IT-2 students randomly distributed between Cyber Security and Software Project Management
        electiveSubject = Math.random() > 0.5 ? subjects[3] : subjects[4];
      } else if (section === 'IT-3') {
        // IT-3 students take Cyber Security with Dr. B. Harish Goud
        electiveSubject = subjects[3];
      }

      if (electiveSubject) {
        const facultyAssignment = await FacultyAssignment.findOne({
          subject: electiveSubject._id,
          sections: { $in: [section] }
        });

        if (facultyAssignment) {
          await Enrollment.create({
            student: student._id,
            subject: electiveSubject._id,
            faculty: facultyAssignment.faculty,
            section: section,
            semester: 5,
            academicYear: '2024-25',
            chosenAsElective: true,
            electiveGroup: 'Professional Elective - 2'
          });
        }
      }
    }

    console.log('IT 3rd Year Complete Data Created Successfully!');
    console.log('\n=== FACULTY LOGIN CREDENTIALS ===');
    console.log('IT Department Faculty:');
    console.log('1. Dr. Gangadhar - Username: gangadhar.sir, Password: password123');
    console.log('   - Enterprise Application Development (Theory + Lab) - All sections');
    console.log('');
    console.log('2. Dr. Suresh Kumar - Username: suresh.kumar, Password: password123');
    console.log('   - Computer Networks (Theory + Lab) - All sections');
    console.log('');
    console.log('3. Dr. Anil Verma - Username: anil.verma, Password: password123');
    console.log('   - Formal Languages & Automata Theory, Competitive Coding - All sections');
    console.log('');
    console.log('4. Mr. U. Sai Ram - Username: u.sairam, Password: password123');
    console.log('   - Cyber Security (Section I) - IT-1, IT-2');
    console.log('');
    console.log('5. Dr. B. Harish Goud - Username: b.harishgoud, Password: password123');
    console.log('   - Cyber Security (Section II) - IT-2, IT-3');
    console.log('');
    console.log('6. Mr. Sai Venkat - Username: sai.venkat, Password: password123');
    console.log('   - Software Project Management - All sections');
    console.log('');
    console.log('CS Department Faculty:');
    console.log('7. Dr. E. Rama Lakshmi - Username: rama.lakshmi, Password: password123');
    console.log('   - Advanced Mathematics - All sections');
    console.log('');
    console.log('8. Dr. Priya Sharma - Username: priya.sharma, Password: password123');
    console.log('   - Professional Ethics - All sections');
    console.log('');
    console.log('9. Dr. Meera Patel - Username: meera.patel, Password: password123');
    console.log('   - Cloud Computing - All sections');

    console.log('\n=== STUDENT INFORMATION ===');
    console.log(`Total Students: ${allStudents.length}`);
    console.log('Section-wise Distribution:');
    console.log(`IT-1: ${allStudents.filter(s => s.section === 'IT-1').length} students`);
    console.log(`IT-2: ${allStudents.filter(s => s.section === 'IT-2').length} students`);
    console.log(`IT-3: ${allStudents.filter(s => s.section === 'IT-3').length} students`);

    console.log('\nSample Student Logins:');
    console.log('IT-1: Username: 160123737001, Password: password123');
    console.log('IT-2: Username: 160123737075, Password: password123');
    console.log('IT-3: Username: 160123737148, Password: password123');

    console.log('\n=== SUBJECTS FOR IT 5th SEMESTER ===');
    console.log('Core Subjects:');
    console.log('1. Enterprise Application Development (22ITC08) - 3 credits');
    console.log('2. Computer Networks (22ITC10) - 3 credits');
    console.log('3. Formal Languages and Automata Theory (22ITC12) - 3 credits');
    console.log('4. Enterprise Application Development Lab (22ITC09) - 1 credit');
    console.log('5. Computer Networks Lab (22ITC11) - 1 credit');
    console.log('6. Competitive Coding (22ITC16) - 1 credit');
    console.log('\nProfessional Electives:');
    console.log('7. Cyber Security (22CIE55) - 3 credits');
    console.log('8. Software Project Management (22ITE04) - 3 credits');
    console.log('9. Cloud Computing (22ITE06) - 3 credits');
    console.log('\nOther Department Subjects:');
    console.log('10. Advanced Mathematics (22MAT11) - 3 credits');
    console.log('11. Professional Ethics (22HUM01) - 2 credits');

    console.log('\n========================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding IT 3rd year data:', error);
    process.exit(1);
  }
};

seedIT3rdYear();
