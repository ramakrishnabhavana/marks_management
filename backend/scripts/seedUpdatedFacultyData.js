import mongoose from 'mongoose';
import Faculty from '../models/Faculty.js';
import Subject from '../models/Subject.js';
import User from '../models/User.js';
import FacultyAssignment from '../models/FacultyAssignment.js';
import connectDB from '../config/db.js';

const seedUpdatedFacultyData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Create Faculty Users
    const facultyUsers = await User.create([
      {
        username: 'rama.lakshmi',
        password: 'password123',
        name: 'Mrs. E. Rama Lakshmi',
        role: 'faculty'
      },
      {
        username: 'shiva.kumar',
        password: 'password123',
        name: 'Mr. N. Shiva Kumar',
        role: 'faculty'
      },
      {
        username: 'sirisha',
        password: 'password123',
        name: 'Dr. A. Sirisha',
        role: 'faculty'
      },
      {
        username: 'harish.goud',
        password: 'password123',
        name: 'Dr. B. Harish Goud',
        role: 'faculty'
      },
      {
        username: 'govardhan.reddy',
        password: 'password123',
        name: 'Mr. R. Govardhan Reddy',
        role: 'faculty'
      },
      {
        username: 'madhuri',
        password: 'password123',
        name: 'Ms. T. Madhuri',
        role: 'faculty'
      },
      {
        username: 'swathi',
        password: 'password123',
        name: 'Mrs. K. Swathi',
        role: 'faculty'
      },
      {
        username: 'jayaram',
        password: 'password123',
        name: 'Dr. D. Jayaram',
        role: 'faculty'
      },
      {
        username: 'ramesh.babu',
        password: 'password123',
        name: 'Dr. P. Ramesh Babu',
        role: 'faculty'
      },
      {
        username: 'pragati',
        password: 'password123',
        name: 'Dr. Pragati Priyadarshinee',
        role: 'faculty'
      },
      {
        username: 'gangadhara',
        password: 'password123',
        name: 'Mr. K. Gangadhara Rao',
        role: 'faculty'
      },
      {
        username: 'sai.ram',
        password: 'password123',
        name: 'Mr. U. Sai Ram',
        role: 'faculty'
      },
      {
        username: 'santhosh',
        password: 'password123',
        name: 'Mr. V. Santhosh',
        role: 'faculty'
      },
      {
        username: 'srikanth',
        password: 'password123',
        name: 'Mr. V. Srikanth',
        role: 'faculty'
      },
      {
        username: 'prathima',
        password: 'password123',
        name: 'Dr. T. Prathima',
        role: 'faculty'
      }
    ]);

    // Create Faculty Profiles
    const faculties = await Faculty.create([
      {
        user: facultyUsers[0]._id,
        name: 'Mrs. E. Rama Lakshmi',
        email: 'rama.lakshmi@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      },
      {
        user: facultyUsers[1]._id,
        name: 'Mr. N. Shiva Kumar',
        email: 'shiva.kumar@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      },
      {
        user: facultyUsers[2]._id,
        name: 'Dr. A. Sirisha',
        email: 'sirisha@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Associate Professor'
      },
      {
        user: facultyUsers[3]._id,
        name: 'Dr. B. Harish Goud',
        email: 'harish.goud@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Associate Professor'
      },
      {
        user: facultyUsers[4]._id,
        name: 'Mr. R. Govardhan Reddy',
        email: 'govardhan.reddy@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      },
      {
        user: facultyUsers[5]._id,
        name: 'Ms. T. Madhuri',
        email: 'madhuri@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      },
      {
        user: facultyUsers[6]._id,
        name: 'Mrs. K. Swathi',
        email: 'swathi@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      },
      {
        user: facultyUsers[7]._id,
        name: 'Dr. D. Jayaram',
        email: 'jayaram@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Associate Professor'
      },
      {
        user: facultyUsers[8]._id,
        name: 'Dr. P. Ramesh Babu',
        email: 'ramesh.babu@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Associate Professor'
      },
      {
        user: facultyUsers[9]._id,
        name: 'Dr. Pragati Priyadarshinee',
        email: 'pragati@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Associate Professor'
      },
      {
        user: facultyUsers[10]._id,
        name: 'Mr. K. Gangadhara Rao',
        email: 'gangadhara@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      },
      {
        user: facultyUsers[11]._id,
        name: 'Mr. U. Sai Ram',
        email: 'sai.ram@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      },
      {
        user: facultyUsers[12]._id,
        name: 'Mr. V. Santhosh',
        email: 'santhosh@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      },
      {
        user: facultyUsers[13]._id,
        name: 'Mr. V. Srikanth',
        email: 'srikanth@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      },
      {
        user: facultyUsers[14]._id,
        name: 'Dr. T. Prathima',
        email: 'prathima@cbit.ac.in',
        department: 'Information Technology',
        designation: 'Assistant Professor'
      }
    ]);

    // Create Subjects
    const subjects = await Subject.create([
      {
        code: '22ITC01',
        name: 'Software Engineering',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITC02',
        name: 'Enterprise Application Development',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITC03',
        name: 'Machine Learning',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITC04',
        name: 'Computer Networks',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITC05',
        name: 'Formal Languages and Automata Theory',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITL01',
        name: 'CASE Tools Lab',
        credits: 1.5,
        type: 'lab',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITL02',
        name: 'Enterprise Application Development Lab',
        credits: 1.5,
        type: 'lab',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITL03',
        name: 'Computer Networks Lab',
        credits: 1.5,
        type: 'lab',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITL04',
        name: 'Machine Learning Lab',
        credits: 1.5,
        type: 'lab',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITL05',
        name: 'Competitive Coding',
        credits: 1.5,
        type: 'lab',
        semester: 5,
        department: 'Information Technology'
      }
    ]);

    // Create Faculty Assignments
    // IT-1 Section Assignments
    await FacultyAssignment.create([
      // Theory Subjects - IT-1
      {
        faculty: faculties[0]._id, // Mrs. E. Rama Lakshmi
        subject: subjects[0]._id, // Software Engineering
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[1]._id, // Mr. N. Shiva Kumar
        subject: subjects[1]._id, // Enterprise Application Development
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[2]._id, // Dr. A. Sirisha
        subject: subjects[2]._id, // Machine Learning
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[3]._id, // Dr. B. Harish Goud
        subject: subjects[3]._id, // Computer Networks
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[4]._id, // Mr. R. Govardhan Reddy
        subject: subjects[4]._id, // Formal Languages and Automata Theory
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },

      // Lab Subjects - IT-1
      {
        faculty: faculties[0]._id, // Mrs. E. Rama Lakshmi
        subject: subjects[5]._id, // CASE Tools Lab
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[1]._id, // Mr. N. Shiva Kumar
        subject: subjects[6]._id, // Enterprise Application Development Lab
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[3]._id, // Dr. B. Harish Goud
        subject: subjects[7]._id, // Computer Networks Lab
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[2]._id, // Dr. A. Sirisha
        subject: subjects[8]._id, // Machine Learning Lab
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[14]._id, // Dr. T. Prathima
        subject: subjects[9]._id, // Competitive Coding
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },

      // IT-2 Section Assignments
      // Theory Subjects - IT-2
      {
        faculty: faculties[5]._id, // Ms. T. Madhuri
        subject: subjects[0]._id, // Software Engineering
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[6]._id, // Mrs. K. Swathi
        subject: subjects[1]._id, // Enterprise Application Development
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[7]._id, // Dr. D. Jayaram
        subject: subjects[2]._id, // Machine Learning
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[8]._id, // Dr. P. Ramesh Babu
        subject: subjects[3]._id, // Computer Networks
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[2]._id, // Dr. A. Sirisha
        subject: subjects[4]._id, // Formal Languages and Automata Theory
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },

      // Lab Subjects - IT-2
      {
        faculty: faculties[5]._id, // Ms. T. Madhuri
        subject: subjects[5]._id, // CASE Tools Lab
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[6]._id, // Mrs. K. Swathi
        subject: subjects[6]._id, // Enterprise Application Development Lab
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[8]._id, // Dr. P. Ramesh Babu
        subject: subjects[7]._id, // Computer Networks Lab
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[7]._id, // Dr. D. Jayaram
        subject: subjects[8]._id, // Machine Learning Lab
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },

      // IT-3 Section Assignments
      // Theory Subjects - IT-3
      {
        faculty: faculties[9]._id, // Dr. Pragati Priyadarshinee
        subject: subjects[0]._id, // Software Engineering
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[10]._id, // Mr. K. Gangadhara Rao
        subject: subjects[1]._id, // Enterprise Application Development
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[11]._id, // Mr. U. Sai Ram
        subject: subjects[2]._id, // Machine Learning
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[12]._id, // Mr. V. Santhosh
        subject: subjects[3]._id, // Computer Networks
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[13]._id, // Mr. V. Srikanth
        subject: subjects[4]._id, // Formal Languages and Automata Theory
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },

      // Lab Subjects - IT-3
      {
        faculty: faculties[9]._id, // Dr. Pragati Priyadarshinee
        subject: subjects[5]._id, // CASE Tools Lab
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[10]._id, // Mr. K. Gangadhara Rao
        subject: subjects[6]._id, // Enterprise Application Development Lab
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[12]._id, // Mr. V. Santhosh
        subject: subjects[7]._id, // Computer Networks Lab
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: faculties[11]._id, // Mr. U. Sai Ram
        subject: subjects[8]._id, // Machine Learning Lab
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      }
    ]);

    console.log('Updated Faculty Data Created Successfully!');
    console.log('\nFaculty assignments have been updated for:');
    console.log('IT-1 Section:');
    console.log('- Mrs. E. Rama Lakshmi (Software Engineering + CASE Tools Lab)');
    console.log('- Mr. N. Shiva Kumar (Enterprise Application Development + Lab)');
    console.log('- Dr. A. Sirisha (Machine Learning + Lab)');
    console.log('- Dr. B. Harish Goud (Computer Networks + Lab)');
    console.log('- Mr. R. Govardhan Reddy (Formal Languages and Automata Theory)');
    console.log('- Dr. T. Prathima (Competitive Coding)');

    console.log('\nIT-2 Section:');
    console.log('- Ms. T. Madhuri (Software Engineering + CASE Tools Lab)');
    console.log('- Mrs. K. Swathi (Enterprise Application Development + Lab)');
    console.log('- Dr. D. Jayaram (Machine Learning + Lab)');
    console.log('- Dr. P. Ramesh Babu (Computer Networks + Lab)');
    console.log('- Dr. A. Sirisha (Formal Languages and Automata Theory)');

    console.log('\nIT-3 Section:');
    console.log('- Dr. Pragati Priyadarshinee (Software Engineering + CASE Tools Lab)');
    console.log('- Mr. K. Gangadhara Rao (Enterprise Application Development + Lab)');
    console.log('- Mr. U. Sai Ram (Machine Learning + Lab)');
    console.log('- Mr. V. Santhosh (Computer Networks + Lab)');
    console.log('- Mr. V. Srikanth (Formal Languages and Automata Theory)');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedUpdatedFacultyData();