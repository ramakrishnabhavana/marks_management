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

class DataSeeder {
  constructor() {
    this.faculties = [];
    this.subjects = [];
    this.students = [];
    this.facultyAssignments = [];
  }

  async connectDB() {
    try {
      const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/marks_management';
      await mongoose.connect(mongoURI);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  async clearExistingData() {
    try {
      await Promise.all([
        User.deleteMany({}),
        Student.deleteMany({}),
        Faculty.deleteMany({}),
        Subject.deleteMany({}),
        Enrollment.deleteMany({}),
        FacultyAssignment.deleteMany({})
      ]);
      console.log('✅ Cleared existing data');
    } catch (error) {
      throw new Error(`Error clearing data: ${error.message}`);
    }
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  async createFacultyMembers() {
    // Fixed faculty data with consistent usernames
    this.facultyData = [
      { username: 'e.rama.lakshmi', name: 'Mrs. E. Rama Lakshmi', email: 'e.rama.lakshmi@cbit.ac.in' },
      { username: 'n.shiva.kumar', name: 'Mr. N. Shiva Kumar', email: 'n.shiva.kumar@cbit.ac.in' },
      { username: 'a.sirisha', name: 'Dr. A. Sirisha', email: 'a.sirisha@cbit.ac.in' },
      { username: 'b.harishgoud', name: 'Dr. B. Harish Goud', email: 'b.harishgoud@cbit.ac.in' },
      { username: 'r.govardhan.reddy', name: 'Mr. R. Govardhan Reddy', email: 'r.govardhan.reddy@cbit.ac.in' },
      { username: 't.madhuri', name: 'Ms. T. Madhuri', email: 't.madhuri@cbit.ac.in' },
      { username: 'k.swathi', name: 'Mrs. K. Swathi', email: 'k.swathi@cbit.ac.in' },
      { username: 'd.jayaram', name: 'Dr. D. Jayaram', email: 'd.jayaram@cbit.ac.in' },
      { username: 'p.ramesh.babu', name: 'Dr. P. Ramesh Babu', email: 'p.ramesh.babu@cbit.ac.in' },
      { username: 't.prathima', name: 'Dr. T. Prathima', email: 't.prathima@cbit.ac.in' },
      { username: 'p.kiranmai', name: 'Ms. P. Kiranmai', email: 'p.kiranmai@cbit.ac.in' },
      { username: 'pragati.priyadarshinee', name: 'Dr. Pragati Priyadarshinee', email: 'pragati.priyadarshinee@cbit.ac.in' },
      { username: 'k.gangadhara.rao', name: 'Mr. K. Gangadhara Rao', email: 'k.gangadhara.rao@cbit.ac.in' },
      { username: 'v.santhosh', name: 'Mr. V. Santhosh', email: 'v.santhosh@cbit.ac.in' },
      { username: 'v.srikanth', name: 'Mr. V. Srikanth', email: 'v.srikanth@cbit.ac.in' },
      { username: 'u.sairam', name: 'Mr. U. Sai Ram', email: 'u.sairam@cbit.ac.in' }
    ];

    // Create users in bulk
    const hashedPassword = await this.hashPassword('password123');
    const userDocs = this.facultyData.map(faculty => ({
      username: faculty.username,
      password: hashedPassword,
      name: faculty.name,
      role: 'faculty'
    }));

    const facultyUsers = await User.insertMany(userDocs);
    console.log(`✅ Created ${facultyUsers.length} faculty users`);

    // Create faculty profiles in bulk
    const facultyProfiles = facultyUsers.map((user, index) => ({
      user: user._id,
      name: this.facultyData[index].name,
      email: this.facultyData[index].email,
      department: 'Information Technology',
      designation: 'Assistant Professor'
    }));

    this.faculties = await Faculty.insertMany(facultyProfiles);
    console.log(`✅ Created ${this.faculties.length} faculty profiles`);

    // Display faculty login credentials
    console.log('\n📚 Faculty Login Credentials:');
    this.facultyData.forEach(faculty => {
      console.log(`Username: ${faculty.username} | Password: password123`);
    });
  }

  async createSubjects() {
    const subjectData = [
      // ==================== THEORY SUBJECTS ====================
      {
        code: '22CSC21',
        name: 'Software Engineering',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22ITC08',
        name: 'Enterprise Application Development',
        credits: 3,
        type: 'theory',
        semester: 5,
        department: 'Information Technology'
      },
      {
        code: '22CAC17',
        name: 'Machine Learning',
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

      // ==================== PRACTICAL/LAB SUBJECTS ====================
      {
        code: '22CSC23',
        name: 'CASE Tools Lab',
        credits: 1,
        type: 'lab',
        semester: 5,
        department: 'Information Technology'
      },
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
        code: '22CAC18',
        name: 'Machine Learning Lab',
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
      }
    ];

    this.subjects = await Subject.insertMany(subjectData);
    console.log(`✅ Created ${this.subjects.length} subjects (5 theory + 5 labs)`);
    
    // Display subjects
    console.log('\n📖 Subjects Created:');
    this.subjects.forEach(subject => {
      console.log(`${subject.code} - ${subject.name} (${subject.credits} credits, ${subject.type})`);
    });
  }

  async createStudents() {
    const studentData = this.getAllStudentsData();
    
    // Create users in bulk
    const hashedPassword = await this.hashPassword('password123');
    const userDocs = studentData.map(student => ({
      username: student.rollNo,
      password: hashedPassword,
      name: student.name,
      role: 'student'
    }));

    const studentUsers = await User.insertMany(userDocs);
    console.log(`✅ Created ${studentUsers.length} student users`);

    // Create student profiles in bulk
    const studentProfiles = studentUsers.map((user, index) => ({
      user: user._id,
      rollNo: studentData[index].rollNo,
      name: studentData[index].name,
      section: studentData[index].section,
      year: 2,
      semester: 5,
      department: 'Information Technology',
      mentor: this.faculties[0]._id // Default mentor
    }));

    this.students = await Student.insertMany(studentProfiles);
    console.log(`✅ Created ${this.students.length} student profiles`);
  }

  async createFacultyAssignments() {
    // Create a proper faculty map by username
    const facultyMap = {};
    this.faculties.forEach((faculty, index) => {
      const username = this.facultyData[index].username;
      facultyMap[username] = faculty._id;
      console.log(`Mapped faculty: ${username} -> ${faculty._id}`);
    });

    // Create a proper subject map by code
    const subjectMap = {};
    this.subjects.forEach((subject) => {
      subjectMap[subject.code] = subject._id;
    });

    const facultyAssignments = [
      // ==================== IT-1 SECTION ====================
      // Core Theory Subjects - IT-1
      {
        faculty: facultyMap['e.rama.lakshmi'],
        subject: subjectMap['22CSC21'], // Software Engineering
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['n.shiva.kumar'],
        subject: subjectMap['22ITC08'], // Enterprise Application Development
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['a.sirisha'],
        subject: subjectMap['22CAC17'], // Machine Learning
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['b.harishgoud'],
        subject: subjectMap['22ITC10'], // Computer Networks
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['r.govardhan.reddy'],
        subject: subjectMap['22ITC12'], // Formal Languages and Automata Theory
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },

      // Core Lab Subjects - IT-1
      {
        faculty: facultyMap['e.rama.lakshmi'],
        subject: subjectMap['22CSC23'], // CASE Tools Lab
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['n.shiva.kumar'],
        subject: subjectMap['22ITC09'], // Enterprise Application Development Lab
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['b.harishgoud'],
        subject: subjectMap['22ITC11'], // Computer Networks Lab
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['a.sirisha'],
        subject: subjectMap['22CAC18'], // Machine Learning Lab
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['t.prathima'],
        subject: subjectMap['22ITC16'], // Competitive Coding
        sections: ['IT-1'],
        semester: 5,
        academicYear: '2025-26'
      },

      // ==================== IT-2 SECTION ====================
      // Core Theory Subjects - IT-2
      {
        faculty: facultyMap['t.madhuri'],
        subject: subjectMap['22CSC21'], // Software Engineering
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['k.swathi'],
        subject: subjectMap['22ITC08'], // Enterprise Application Development
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['d.jayaram'],
        subject: subjectMap['22CAC17'], // Machine Learning
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['p.ramesh.babu'],
        subject: subjectMap['22ITC10'], // Computer Networks
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['a.sirisha'],
        subject: subjectMap['22ITC12'], // Formal Languages and Automata Theory
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },

      // Core Lab Subjects - IT-2
      {
        faculty: facultyMap['t.madhuri'],
        subject: subjectMap['22CSC23'], // CASE Tools Lab
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['k.swathi'],
        subject: subjectMap['22ITC09'], // Enterprise Application Development Lab
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['p.ramesh.babu'],
        subject: subjectMap['22ITC11'], // Computer Networks Lab
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['d.jayaram'],
        subject: subjectMap['22CAC18'], // Machine Learning Lab
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['p.kiranmai'],
        subject: subjectMap['22ITC16'], // Competitive Coding
        sections: ['IT-2'],
        semester: 5,
        academicYear: '2025-26'
      },

      // ==================== IT-3 SECTION ====================
      // Core Theory Subjects - IT-3
      {
        faculty: facultyMap['pragati.priyadarshinee'],
        subject: subjectMap['22CSC21'], // Software Engineering
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['k.gangadhara.rao'],
        subject: subjectMap['22ITC08'], // Enterprise Application Development
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['u.sairam'],
        subject: subjectMap['22CAC17'], // Machine Learning
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['v.santhosh'],
        subject: subjectMap['22ITC10'], // Computer Networks
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['v.srikanth'],
        subject: subjectMap['22ITC12'], // Formal Languages and Automata Theory
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },

      // Core Lab Subjects - IT-3
      {
        faculty: facultyMap['pragati.priyadarshinee'],
        subject: subjectMap['22CSC23'], // CASE Tools Lab
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['k.gangadhara.rao'],
        subject: subjectMap['22ITC09'], // Enterprise Application Development Lab
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['v.santhosh'],
        subject: subjectMap['22ITC11'], // Computer Networks Lab
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['u.sairam'],
        subject: subjectMap['22CAC18'], // Machine Learning Lab
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      },
      {
        faculty: facultyMap['p.kiranmai'],
        subject: subjectMap['22ITC16'], // Competitive Coding
        sections: ['IT-3'],
        semester: 5,
        academicYear: '2025-26'
      }
    ];

    // Validate all assignments before inserting
    const validAssignments = facultyAssignments.filter(assignment => {
      if (!assignment.faculty) {
        console.log(`❌ Invalid faculty assignment for subject: ${assignment.subject}`);
        return false;
      }
      if (!assignment.subject) {
        console.log(`❌ Invalid subject assignment for faculty`);
        return false;
      }
      return true;
    });

    this.facultyAssignments = await FacultyAssignment.insertMany(validAssignments);
    console.log(`✅ Created ${this.facultyAssignments.length} faculty assignments`);
  }

  async createEnrollments() {
    const enrollments = [];

    // Create enrollments for all subjects (core theory and labs) based on faculty assignments
    for (const student of this.students) {
      // Get all faculty assignments for this student's section and semester
      const assignments = this.facultyAssignments.filter(assignment =>
        assignment.sections.includes(student.section) && assignment.semester === 5
      );

      for (const assignment of assignments) {
        enrollments.push({
          student: student._id,
          subject: assignment.subject,
          faculty: assignment.faculty,
          section: student.section,
          semester: 5,
          chosenAsElective: false,
          electiveGroup: null
        });
      }
    }

    if (enrollments.length > 0) {
      await Enrollment.insertMany(enrollments);
      console.log(`✅ Created ${enrollments.length} enrollments`);
      console.log(`📚 Each student enrolled in ${enrollments.length / this.students.length} subjects`);
    }
  }

  getAllStudentsData() {
    // Combine all students from all sections
    const it1Students = [
      { rollNo: '160123737001', name: 'APPALA MEENAKSHI SINDHUJA', section: 'IT-1' },
      { rollNo: '160123737002', name: 'ARIBA FATIMA', section: 'IT-1' },
      { rollNo: '160123737003', name: 'HIRANMAI BANALA', section: 'IT-1' },
      { rollNo: '160123737004', name: 'BANAVATH ANUSHA', section: 'IT-1' },
      { rollNo: '160123737005', name: 'BASSA. SRILAKSHMI', section: 'IT-1' },
      { rollNo: '160123737006', name: 'B.SRIMUGDHA', section: 'IT-1' },
      { rollNo: '160123737007', name: 'BHUKYA SWAPNA', section: 'IT-1' },
      { rollNo: '160123737008', name: 'BONALA. LAXMI PRASANNA', section: 'IT-1' },
      { rollNo: '160123737009', name: 'TRISHACHALLA', section: 'IT-1' },
      { rollNo: '160123737010', name: 'CHEEMARLA RISHITHA', section: 'IT-1' },
      { rollNo: '160123737011', name: 'DAIDALA RUTHVIKA REDDY', section: 'IT-1' },
      { rollNo: '160123737012', name: 'DEVANABOYINA CHANDANA', section: 'IT-1' },
      { rollNo: '160123737013', name: 'SAHASRA', section: 'IT-1' },
      { rollNo: '160123737014', name: 'KHAZI AAFREEN', section: 'IT-1' },
      { rollNo: '160123737015', name: 'M ANUSREE', section: 'IT-1' },
      { rollNo: '160123737016', name: 'M ADITI', section: 'IT-1' },
      { rollNo: '160123737017', name: 'MARPALLI NIKHITHA SREE', section: 'IT-1' },
      { rollNo: '160123737018', name: 'MATTAM SAHITHI', section: 'IT-1' },
      { rollNo: '160123737019', name: 'NILAGAL NAVARATNA', section: 'IT-1' },
      { rollNo: '160123737020', name: 'NANDINI PERVAR', section: 'IT-1' },
      { rollNo: '160123737021', name: 'SAMIKSHA PODICHETTY', section: 'IT-1' },
      { rollNo: '160123737022', name: 'VASUNDHRA DEVI', section: 'IT-1' },
      { rollNo: '160123737023', name: 'RASHI KAUR', section: 'IT-1' },
      { rollNo: '160123737024', name: 'SAHITI EDUPUGANTI', section: 'IT-1' },
      { rollNo: '160123737025', name: 'JENNIFER SHALOM', section: 'IT-1' },
      { rollNo: '160123737026', name: 'SK ALMASE GOHER', section: 'IT-1' },
      { rollNo: '160123737027', name: 'SOUMYA VEMURI', section: 'IT-1' },
      { rollNo: '160123737028', name: 'NIKITHA YAMSANI', section: 'IT-1' },
      { rollNo: '160123737029', name: 'ABDUL RAHEEM', section: 'IT-1' },
      { rollNo: '160123737030', name: 'AMIT KUMAR', section: 'IT-1' },
      { rollNo: '160123737031', name: 'ANISH KODURU', section: 'IT-1' },
      { rollNo: '160123737032', name: 'A VISHNU VARDHAN REDDY', section: 'IT-1' },
      { rollNo: '160123737033', name: 'AYUSH KUMAR SINGH', section: 'IT-1' },
      { rollNo: '160123737034', name: 'B VISHNUVARDAN', section: 'IT-1' },
      { rollNo: '160123737035', name: 'B.SAI LOHITH', section: 'IT-1' },
      { rollNo: '160123737036', name: 'BOINI VIVEK', section: 'IT-1' },
      { rollNo: '160123737037', name: 'SURYA VARMA CHERUKURI', section: 'IT-1' },
      { rollNo: '160123737038', name: 'D.THIRUPATHI', section: 'IT-1' },
      { rollNo: '160123737039', name: 'GANDHARI VARUN REDDY', section: 'IT-1' },
      { rollNo: '160123737040', name: 'GUDIBANDA KRISHNA MANOHAR REDDY', section: 'IT-1' },
      { rollNo: '160123737041', name: 'HRUTHIK', section: 'IT-1' },
      { rollNo: '160123737042', name: 'K.H.HARSH', section: 'IT-1' },
      { rollNo: '160123737043', name: 'K.MANICHANDER', section: 'IT-1' },
      { rollNo: '160123737044', name: 'K.MANMOHAN RATHOD', section: 'IT-1' },
      { rollNo: '160123737045', name: 'KETHAVATH NAVEEN', section: 'IT-1' },
      { rollNo: '160123737046', name: 'AKASH', section: 'IT-1' },
      { rollNo: '160123737047', name: 'L. NITHISH NAIK', section: 'IT-1' },
      { rollNo: '160123737048', name: 'M.BHARAT KUMAR', section: 'IT-1' },
      { rollNo: '160123737049', name: 'MEDAPALLY SHIVA REDDY', section: 'IT-1' },
      { rollNo: '160123737050', name: 'M ABHILASH REDDY', section: 'IT-1' },
      { rollNo: '160123737051', name: 'MOHAMMED ABDUL RAFE SAJID', section: 'IT-1' },
      { rollNo: '160123737052', name: 'MOLUGU SHASHANK', section: 'IT-1' },
      { rollNo: '160123737053', name: 'N YASHWANTH SARMA', section: 'IT-1' },
      { rollNo: '160123737054', name: 'NIRISH REDDY', section: 'IT-1' },
      { rollNo: '160123737055', name: 'OM UPLENCHWAR', section: 'IT-1' },
      { rollNo: '160123737056', name: 'PALLE SAIRAM GOUD', section: 'IT-1' },
      { rollNo: '160123737057', name: 'P.RUPESH KUMAR', section: 'IT-1' },
      { rollNo: '160123737058', name: 'PRATYUSH KUMAR', section: 'IT-1' },
      { rollNo: '160123737059', name: 'VYAS RALLAPALLI', section: 'IT-1' },
      { rollNo: '160123737060', name: 'SADE VARUN TEJ VARMA', section: 'IT-1' },
      { rollNo: '160123737061', name: 'SARVESH JHAWAR', section: 'IT-1' },
      { rollNo: '160123737062', name: 'SURYA PRANAY GOUD', section: 'IT-1' },
      { rollNo: '160123737063', name: 'SWETHAK SWARNA', section: 'IT-1' },
      { rollNo: '160123737064', name: 'THATIKONDA VIKRAM', section: 'IT-1' },
      { rollNo: '160123737065', name: 'VEMURI VENKATA PHANI KUMAR', section: 'IT-1' },
      { rollNo: '160123737066', name: 'VOTUKURU NOMESH REDDY', section: 'IT-1' },
      { rollNo: '160123737067', name: 'YARRABOTHULA DILEEP', section: 'IT-1' },
      { rollNo: '161023737301', name: 'A SAI PRAKASH', section: 'IT-1' },
      { rollNo: '160123737303', name: 'NAGARAJU RODOPOLLU', section: 'IT-1' },
      { rollNo: '160123737304', name: 'GANDHASIRI SATHWIKA', section: 'IT-1' },
      { rollNo: '160123737305', name: 'GUNDELLY SRUJANA', section: 'IT-1' },
      { rollNo: '160123737306', name: 'ANGADI JYOTHSNA', section: 'IT-1' },
      { rollNo: '160123737307', name: 'BANOTH SRIDEVI', section: 'IT-1' }
    ];

    const it2Students = [
      { rollNo: '160123737071', name: 'AMETI AKSHITHA', section: 'IT-2' },
      { rollNo: '160123737072', name: 'HAMSAGOUNI RITHIKA', section: 'IT-2' },
      { rollNo: '160123737073', name: 'KANDIMALLA SONY', section: 'IT-2' },
      { rollNo: '160123737074', name: 'LAKSHANA.S', section: 'IT-2' },
      { rollNo: '160123737075', name: 'MEGHANA', section: 'IT-2' },
      { rollNo: '160123737076', name: 'MEHERUNNISA', section: 'IT-2' },
      { rollNo: '160123737077', name: 'NIMMALA MADHURI', section: 'IT-2' },
      { rollNo: '160123737079', name: 'PATI TEJASWINI', section: 'IT-2' },
      { rollNo: '160123737080', name: 'POLKAMPALLI PRAGNA', section: 'IT-2' },
      { rollNo: '160123737081', name: 'SAHITHI', section: 'IT-2' },
      { rollNo: '160123737082', name: 'SARASWATULA SAMHITHA', section: 'IT-2' },
      { rollNo: '160123737083', name: 'NIRUPAMA', section: 'IT-2' },
      { rollNo: '160123737084', name: 'SRIRAMPURAM SUDHIKSHA REDDY', section: 'IT-2' },
      { rollNo: '160123737085', name: 'T.RAKSHITHA', section: 'IT-2' },
      { rollNo: '160123737086', name: 'THIRUKOVELA MOULYA', section: 'IT-2' },
      { rollNo: '160123737087', name: 'MELISA BLOSSOM', section: 'IT-2' },
      { rollNo: '160123737088', name: 'PRAVALIKA', section: 'IT-2' },
      { rollNo: '160123737089', name: 'VIDIYALA ASHRITHA', section: 'IT-2' },
      { rollNo: '160123737090', name: 'VUPPULAPU BHAVYA', section: 'IT-2' },
      { rollNo: '160123737091', name: 'HARSHITA VUTHALURU', section: 'IT-2' },
      { rollNo: '160123737092', name: 'ABDUL GAFOOR', section: 'IT-2' },
      { rollNo: '160123737093', name: 'ABHIJITH DUGGARAJU', section: 'IT-2' },
      { rollNo: '160123737094', name: 'ABHISHEK KUMAR SINGH', section: 'IT-2' },
      { rollNo: '160123737095', name: 'A.BHARGAVA KRISHNA', section: 'IT-2' },
      { rollNo: '160123737096', name: 'ALETI ANUDEEP REDDY', section: 'IT-2' },
      { rollNo: '160123737097', name: 'ASHISH GUPTA', section: 'IT-2' },
      { rollNo: '160123737098', name: 'BANDI SAI RISHWANTH', section: 'IT-2' },
      { rollNo: '160123737099', name: 'REVANTH BOJJA', section: 'IT-2' },
      { rollNo: '160123737101', name: 'DIRISINAPU JYOTHI VIKRAMA SIMHA REDDY', section: 'IT-2' },
      { rollNo: '160123737102', name: 'DODDA JITENDRA', section: 'IT-2' },
      { rollNo: '160123737103', name: 'D.RUPESH REDDY', section: 'IT-2' },
      { rollNo: '160123737104', name: 'SHIVA GANGISHETTY', section: 'IT-2' },
      { rollNo: '160123737105', name: 'G.NITHISH KUMAR', section: 'IT-2' },
      { rollNo: '160123737106', name: 'GRANDHI AVINASH', section: 'IT-2' },
      { rollNo: '160123737107', name: 'GULLA MANEESH', section: 'IT-2' },
      { rollNo: '160123737108', name: 'INDROJI SAI SUSHANK', section: 'IT-2' },
      { rollNo: '160123737109', name: 'JAJIMOGGALA SUNIL', section: 'IT-2' },
      { rollNo: '160123737110', name: 'K.SANCHAY JAIN', section: 'IT-2' },
      { rollNo: '160123737111', name: 'K.SAI KIRAN', section: 'IT-2' },
      { rollNo: '160123737112', name: 'KALYANAM ROSHAN VARMA', section: 'IT-2' },
      { rollNo: '160123737113', name: 'K PREMSAGAR', section: 'IT-2' },
      { rollNo: '160123737114', name: 'HARSHITH MANIK', section: 'IT-2' },
      { rollNo: '160123737115', name: 'KANATALA SIDDHARTHA', section: 'IT-2' },
      { rollNo: '160123737116', name: 'CHARAN KANKIPATI', section: 'IT-2' },
      { rollNo: '160123737117', name: 'J.KARTHIKEYA', section: 'IT-2' },
      { rollNo: '160123737118', name: 'KOTA PUNNAM', section: 'IT-2' },
      { rollNo: '160123737119', name: 'K.SRISAI', section: 'IT-2' },
      { rollNo: '160123737120', name: 'LAKSH JAIN', section: 'IT-2' },
      { rollNo: '160123737121', name: 'M. NAVEEN KUMAR', section: 'IT-2' },
      { rollNo: '160123737122', name: 'M.VEDAANTH SINGH', section: 'IT-2' },
      { rollNo: '160123737123', name: 'MAJJI SANDEEP', section: 'IT-2' },
      { rollNo: '160123737124', name: 'MOHD HASSAN', section: 'IT-2' },
      { rollNo: '160123737125', name: 'YOGESH CHOUDHARY', section: 'IT-2' },
      { rollNo: '160123737126', name: 'NALLAPOTHULA SHEKAR NAIDU', section: 'IT-2' },
      { rollNo: '160123737127', name: 'N.MANISH', section: 'IT-2' },
      { rollNo: '160123737128', name: 'P.V.ABHIRAM', section: 'IT-2' },
      { rollNo: '160123737129', name: 'POLICE VIGNESHWAR REDDY', section: 'IT-2' },
      { rollNo: '160123737130', name: 'REKULARAPU MURALI', section: 'IT-2' },
      { rollNo: '160123737131', name: 'S SAI ASHRITH V R K N', section: 'IT-2' },
      { rollNo: '160123737132', name: 'SAMA ASHOK', section: 'IT-2' },
      { rollNo: '160123737133', name: 'PRANAVENDRA', section: 'IT-2' },
      { rollNo: '160123737134', name: 'SHAIK AQEEL AHAMED', section: 'IT-2' },
      { rollNo: '160123737135', name: 'SUSHANTH REDDY KASIREDDY', section: 'IT-2' },
      { rollNo: '160123737136', name: 'T PREETHAM REDDY', section: 'IT-2' },
      { rollNo: '160123737137', name: 'TUNGENA SHARATH', section: 'IT-2' },
      { rollNo: '160123737308', name: 'CHITTURI NAGA RAJA TEJA ROHITH', section: 'IT-2' },
      { rollNo: '160123737309', name: 'MOTHKURI RANVITHA', section: 'IT-2' },
      { rollNo: '160123737310', name: 'KARNATAKAPU RAMAKRISHNA', section: 'IT-2' },
      { rollNo: '160123737311', name: 'THATIKANTI ROHITH', section: 'IT-2' },
      { rollNo: '160123737312', name: 'SINDHUJA BODDULA', section: 'IT-2' },
      { rollNo: '160123737313', name: 'AKKENAPALLY NIKHIL', section: 'IT-2' },
      { rollNo: '160123737314', name: 'BANOTH ANIL', section: 'IT-2' }
    ];

    const it3Students = [
      { rollNo: '160123737141', name: 'AMJA MAITHILI', section: 'IT-3' },
      { rollNo: '160123737142', name: 'AVANI CHETLURI', section: 'IT-3' },
      { rollNo: '160123737143', name: 'SONALI BANAPURAM', section: 'IT-3' },
      { rollNo: '160123737144', name: 'B. PRIYANKA', section: 'IT-3' },
      { rollNo: '160123737145', name: 'BHAVANA RAMAKRISHNA', section: 'IT-3' },
      { rollNo: '160123737146', name: 'BOBBALA HARSHITHA', section: 'IT-3' },
      { rollNo: '160123737147', name: 'CHINTHAKINDHI NISHITHA', section: 'IT-3' },
      { rollNo: '160123737148', name: 'E.SPANDANA', section: 'IT-3' },
      { rollNo: '160123737149', name: 'GAALI SAI PRAHARSHITA', section: 'IT-3' },
      { rollNo: '160123737150', name: 'GADASANDULA AKSHATHA', section: 'IT-3' },
      { rollNo: '160123737151', name: 'KANDHURI SAI RASAGNA', section: 'IT-3' },
      { rollNo: '160123737152', name: 'MADATHANAPALLE LEENA', section: 'IT-3' },
      { rollNo: '160123737153', name: 'M VEDA SRI', section: 'IT-3' },
      { rollNo: '160123737154', name: 'M.PRAVALLIKA REDDY', section: 'IT-3' },
      { rollNo: '160123737155', name: 'MANASA MORTHAD', section: 'IT-3' },
      { rollNo: '160123737156', name: 'MIDDE JAHNAVI', section: 'IT-3' },
      { rollNo: '160123737157', name: 'HARSHITHA', section: 'IT-3' },
      { rollNo: '160123737158', name: 'POCHAMPELLY DEEKSHITHA', section: 'IT-3' },
      { rollNo: '160123737159', name: 'PRIVANSHU NERELLA', section: 'IT-3' },
      { rollNo: '160123737160', name: 'P.DHANUSHKA', section: 'IT-3' },
      { rollNo: '160123737161', name: 'RIDA SHAIK', section: 'IT-3' },
      { rollNo: '160123737162', name: 'SAMEEKSHA PADIGELAWAR', section: 'IT-3' },
      { rollNo: '160123737163', name: 'SHRAVYA JALLEPALLY', section: 'IT-3' },
      { rollNo: '160123737164', name: 'SISTLA KEERTHANA', section: 'IT-3' },
      { rollNo: '160123737165', name: 'SRIIA SRIRAMDAS', section: 'IT-3' },
      { rollNo: '160123737166', name: 'SURYAPETA SRAVANI', section: 'IT-3' },
      { rollNo: '160123737167', name: 'SRICHANDANA', section: 'IT-3' },
      { rollNo: '160123737168', name: 'AMBEER SHRAVAN KUMAR', section: 'IT-3' },
      { rollNo: '160123737169', name: 'ASHISH PATHAK', section: 'IT-3' },
      { rollNo: '160123737170', name: 'BAIRY SHIVA KARTHIK', section: 'IT-3' },
      { rollNo: '160123737171', name: 'BANDARI LAKSHMANA PRASAD', section: 'IT-3' },
      { rollNo: '160123737172', name: 'BATTPROLU SAI JEEVAN', section: 'IT-3' },
      { rollNo: '160123737173', name: 'BHARGAV KOLLURU', section: 'IT-3' },
      { rollNo: '160123737174', name: 'B. JAYANTH REDDY', section: 'IT-3' },
      { rollNo: '160123737175', name: 'CH.SAI NITHIN REDDY', section: 'IT-3' },
      { rollNo: '160123737176', name: 'HANOK KANNA', section: 'IT-3' },
      { rollNo: '160123737177', name: 'D. RITHWIK MOHAN', section: 'IT-3' },
      { rollNo: '160123737178', name: 'GARREPALLY RAMA RAGHAVA', section: 'IT-3' },
      { rollNo: '160123737179', name: 'GODISHALA ASHWITH', section: 'IT-3' },
      { rollNo: '160123737180', name: 'IMTISAL HUSSAIN RANGREZ', section: 'IT-3' },
      { rollNo: '160123737181', name: 'JAKKU SANTHOSH REDDY', section: 'IT-3' },
      { rollNo: '160123737182', name: 'KADIMI VENKATA SHASHANK YADAV', section: 'IT-3' },
      { rollNo: '160123737183', name: 'K.RAJ GURU', section: 'IT-3' },
      { rollNo: '160123737184', name: 'MOHIT NAREN', section: 'IT-3' },
      { rollNo: '160123737185', name: 'VARUNDEEP REDDY KODURU', section: 'IT-3' },
      { rollNo: '160123737186', name: 'KORPOLE KRISHNA KARTHIK REDDY', section: 'IT-3' },
      { rollNo: '160123737187', name: 'KURUVELLA SAI BALAJI', section: 'IT-3' },
      { rollNo: '160123737188', name: 'SATVIK REDDY', section: 'IT-3' },
      { rollNo: '160123737189', name: 'SRUJAN NAYAK', section: 'IT-3' },
      { rollNo: '160123737190', name: 'MANUVARTHI SESHADRI NAIDU', section: 'IT-3' },
      { rollNo: '160123737191', name: 'MEHMOOD ALI', section: 'IT-3' },
      { rollNo: '160123737192', name: 'MEKA VIRJ', section: 'IT-3' },
      { rollNo: '160123737193', name: 'MELLAM ANISH', section: 'IT-3' },
      { rollNo: '160123737194', name: 'MERUGU SAIKOUSHIK', section: 'IT-3' },
      { rollNo: '160123737195', name: 'MOHAMMED FAIZAN UL ISLAM', section: 'IT-3' },
      { rollNo: '160123737196', name: 'N S SASHANK EMMIDI', section: 'IT-3' },
      { rollNo: '160123737197', name: 'NAGAM SRIVATSAV REDDY', section: 'IT-3' },
      { rollNo: '160123737198', name: 'NIKHIL GEORGE', section: 'IT-3' },
      { rollNo: '160123737199', name: 'PASHAM KARTHIK', section: 'IT-3' },
      { rollNo: '160123737200', name: 'PATNALA ABINAYKUMAR', section: 'IT-3' },
      { rollNo: '160123737201', name: 'ABHIRAM POLA', section: 'IT-3' },
      { rollNo: '160123737202', name: 'RAHUL ARRA', section: 'IT-3' },
      { rollNo: '160123737203', name: 'RAMAVATH NAVEEN', section: 'IT-3' },
      { rollNo: '160123737204', name: 'SARIKELLA MADHU', section: 'IT-3' },
      { rollNo: '160123737205', name: 'THODUPUNOORI SAI MANISH', section: 'IT-3' },
      { rollNo: '160123737206', name: 'ROHIT THOTA', section: 'IT-3' },
      { rollNo: '160123737207', name: 'VEDITH VANAM', section: 'IT-3' },
      { rollNo: '160123737315', name: 'MALE VIGNESHWAR REDDY', section: 'IT-3' },
      { rollNo: '160123737316', name: 'BORRA PUJITH GANESH', section: 'IT-3' },
      { rollNo: '160123737317', name: 'NAGUNURI SHASHIDHAR', section: 'IT-3' },
      { rollNo: '160123737318', name: 'BOBBALA VARSHINI', section: 'IT-3' },
      { rollNo: '160123737319', name: 'AKBER HUSSAIN', section: 'IT-3' },
      { rollNo: '160123737320', name: 'MAISA ANUSHKA', section: 'IT-3' }
    ];

    return [...it1Students, ...it2Students, ...it3Students];
  }

  displayCredentials() {
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('\n📚 FACULTY ACCOUNTS:');
    console.log('All faculty use their username and password: "password123"');
    console.log('Example faculty usernames:');
    console.log('  - e.rama.lakshmi');
    console.log('  - n.shiva.kumar'); 
    console.log('  - a.sirisha');
    console.log('  - b.harishgoud');
    console.log('  - t.madhuri');
    
    console.log('\n🎓 STUDENT ACCOUNTS:');
    console.log('All students use their roll number as username and password: "password123"');
    console.log('Example student usernames:');
    console.log('  - 160123737001');
    console.log('  - 160123737071');
    console.log('  - 160123737141');
    
    console.log('\n📊 DATABASE SUMMARY:');
    console.log(`Total Students: ${this.students.length}`);
    console.log(`Total Faculty: ${this.faculties.length}`);
    console.log(`Total Subjects: ${this.subjects.length} (5 theory + 5 labs)`);
    console.log(`Total Faculty Assignments: ${this.facultyAssignments.length}`);
    console.log(`Subjects per student: 10 (5 theory + 5 labs)`);
    console.log('\n========================\n');
  }

  async seed() {
    try {
      console.log('🚀 Starting data seeding process...\n');
      
      await this.connectDB();
      await this.clearExistingData();
      
      await this.createFacultyMembers();
      await this.createSubjects();
      await this.createStudents();
      await this.createFacultyAssignments();
      await this.createEnrollments();

      console.log('\n✅ All data seeded successfully!');
      this.displayCredentials();

    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    }
  }
}

// Enhanced main execution with better error handling
const seedRealData = async () => {
  const seeder = new DataSeeder();
  
  try {
    await seeder.seed();
    setTimeout(() => {
      console.log('Seeding completed. Exiting...');
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error('💥 Seeding failed:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⚠️  Received SIGINT. Closing database connection...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Promise Rejection:', err);
  process.exit(1);
});

export default seedRealData;