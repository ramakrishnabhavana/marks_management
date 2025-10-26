import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import { Student } from '../models/student.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Subject } from '../models/subject.model.js';
import { Enrollment } from '../models/enrollments.model.js';
import { FacultyAssignment } from '../models/faculty_assignments.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marks_management';

// Core subjects from timetable
const coreSubjects = [
  { code: '22CSC21', name: 'Software Engineering' },
  { code: '22ITC08', name: 'Enterprise Application Development' },
  { code: '22CAC17', name: 'Machine Learning' },
  { code: '22ITC10', name: 'Computer Networks' },
  { code: '22ITC12', name: 'Formal Languages and Automata Theory' }
];

// Elective subjects
const electiveSubjects = [
  { code: '22CIE55', name: 'Cyber Security', isElective: true, electivesGroup: 'PE-2' },
  { code: '22ITE06', name: 'Software Project Management', isElective: true, electivesGroup: 'PE-2' }
];

// Lab subjects
const labSubjects = [
  { code: '22CSC23', name: 'CASE Tools Lab' },
  { code: '22ITC09', name: 'Enterprise Application Development Lab' },
  { code: '22ITC11', name: 'Computer Networks Lab' },
  { code: '22CAC18', name: 'Machine Learning Lab' },
  { code: '22ITC16', name: 'Competitive Coding' }
];

// Faculty data from your files
const facultyData = [
  // Core faculty
  { name: 'Mrs. E. Rama Lakshmi', email: 'eramalakshmi.it@cbit.ac.in', mobile: '9553602042' },
  { name: 'Mr. N. Shiva Kumar', email: 'shivakumarit@cbit.ac.in', mobile: '8008832804' },
  { name: 'Dr. A. Sirisha', email: 'asirisha.it@cbit.ac.in', mobile: '9885266048' },
  { name: 'Dr. B. Harish Goud', email: 'harishgoudi.it@cbit.ac.in', mobile: '9492863506' },
  { name: 'Mr. R. Govardhan Reddy', email: 'rgovardhanreddy.it@cbit.ac.in', mobile: '8886161630' },
  { name: 'Mr. U. Sai Ram', email: 'usairam.it@cbit.ac.in', mobile: '8143364133' },
  { name: 'Mr. R. Sai Venkat', email: 'saivenkatt.it@cbit.ac.in', mobile: '7893286916' },
  { name: 'Mr. V. Santhosh', email: 'vsantosh.it@cbit.ac.in', mobile: '9030012209' },

  // Additional faculty from other sections
  { name: 'Ms. T. Madhuri', email: 'tmadhuri.it@cbit.ac.in', mobile: '8985549671' },
  { name: 'Mrs. K. Swathi', email: 'kswathi.it@cbit.ac.in', mobile: '9491388749' },
  { name: 'Dr. D. Jayaram', email: 'djayaram.it@cbit.ac.in', mobile: '9182578316' },
  { name: 'Dr. P. Ramesh Babu', email: 'prameshbabu.it@cbit.ac.in', mobile: '9293750019' },
  { name: 'Dr. Pragati Priyadarshinee', email: 'pragatipriyadarshinee.it@cbit.ac.in', mobile: '8879827220' },
  { name: 'Mr. K. Gangadhara rao', email: 'kgangadhara.it@cbit.ac.in', mobile: '8977218085' },
  { name: 'Dr. K. Sugamya', email: 'ksugamya.it@cbit.ac.in', mobile: '9849673938' },
  { name: 'Mr. G. Srikanth', email: 'srikanthg.it@cbit.ac.in', mobile: '9397807156' },
  { name: 'Ms. P. Kiramnale', email: 'kiramnale.it@cbit.ac.in', mobile: '9032315262' },
  { name: 'Dr. B. Swathi Sowmya', email: 'swathisowmya.it@cbit.ac.in', mobile: '9494568008' }
];

// Student data ranges from your files
const studentRanges = [
  // IT-1 Students (roll 001-067 + 301-307)
  { start: 160123737001, end: 160123737067, section: 'IT-1' },
  { start: 160123737301, end: 160123737307, section: 'IT-1' },

  // IT-2 Students (roll 071-137 + 308-314)
  { start: 160123737071, end: 160123737077, section: 'IT-2' },
  { start: 160123737079, end: 160123737095, section: 'IT-2' },
  { start: 160123737096, end: 160123737137, section: 'IT-2' },
  { start: 160123737308, end: 160123737314, section: 'IT-2' },

  // IT-3 Students (roll 141-207 + 315-320)
  { start: 160123737141, end: 160123737207, section: 'IT-3' },
  { start: 160123737315, end: 160123737320, section: 'IT-3' }
];

// Elective choices from your files
const cyberSecurityStudents = [
  // IT-1 CS students
  160123737001, 160123737002, 160123737004, 160123737005, 160123737006, 160123737008,
  160123737011, 160123737012, 160123737013, 160123737014, 160123737015, 160123737016,
  160123737017, 160123737018, 160123737019, 160123737020, 160123737021, 160123737022,
  160123737024, 160123737026, 160123737027, 160123737028, 160123737029, 160123737032,
  160123737034, 160123737037, 160123737038, 160123737039, 160123737040, 160123737041,
  160123737042, 160123737043, 160123737044, 160123737045, 160123737046, 160123737048,
  160123737050, 160123737051, 160123737052, 160123737054, 160123737055, 160123737056,
  160123737057, 160123737058, 160123737059, 160123737060, 160123737061, 160123737062,
  160123737063, 160123737064, 160123737065, 160123737301, 160123737303, 160123737304,
  160123737305, 160123737306, 160123737307,

  // IT-2 CS students
  160123737071, 160123737072, 160123737073, 160123737074, 160123737075, 160123737076,
  160123737077, 160123737079, 160123737080, 160123737081, 160123737083, 160123737084,
  160123737085, 160123737086, 160123737087, 160123737088, 160123737089, 160123737090,
  160123737091, 160123737093, 160123737094, 160123737096, 160123737097, 160123737098,
  160123737102, 160123737103, 160123737104, 160123737105, 160123737108, 160123737109,
  160123737110, 160123737111, 160123737112, 160123737114, 160123737115, 160123737116,
  160123737117, 160123737118, 160123737119, 160123737121, 160123737123, 160123737124,
  160123737126, 160123737127, 160123737128, 160123737129, 160123737130, 160123737133,
  160123737135, 160123737308, 160123737309, 160123737310, 160123737311, 160123737313,
  160123737314,

  // IT-3 CS students
  160123737144, 160123737145, 160123737147, 160123737148, 160123737149, 160123737150,
  160123737154, 160123737155, 160123737158, 160123737160, 160123737161, 160123737163,
  160123737164, 160123737166, 160123737167, 160123737168, 160123737169, 160123737174,
  160123737175, 160123737176, 160123737179, 160123737180, 160123737183, 160123737186,
  160123737187, 160123737188, 160123737189, 160123737191, 160123737193, 160123737194,
  160123737195, 160123737199, 160123737200, 160123737201, 160123737202, 160123737203,
  160123737204, 160123737205, 160123737206, 160123737207, 160123737315, 160123737318,
  160123737319, 160123737320
];

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Subject.deleteMany({});
    await Enrollment.deleteMany({});
    await FacultyAssignment.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create Subjects
    const allSubjects = [...coreSubjects, ...electiveSubjects, ...labSubjects];
    const subjectDocs = {};

    for (const sub of allSubjects) {
      const subject = await Subject.create(sub);
      subjectDocs[sub.code] = subject;
      console.log(`📚 Created subject: ${sub.code} - ${sub.name}`);
    }

    // Create Faculty
    const facultyDocs = {};
    for (const fac of facultyData) {
      const passwordHash = await bcrypt.hash(fac.name, 10);
      const user = await User.create({
        username: fac.name,
        passwordHash,
        role: 'faculty',
        name: fac.name,
        email: fac.email
      });

      const faculty = await Faculty.create({
        user: user._id,
        name: fac.name,
        email: fac.email,
        mobile: fac.mobile
      });

      facultyDocs[fac.name] = faculty;
      console.log(`👨‍🏫 Created faculty: ${fac.name}`);
    }

    // Create Students
    const studentDocs = {};
    for (const range of studentRanges) {
      for (let roll = range.start; roll <= range.end; roll++) {
        const rollStr = roll.toString();
        const passwordHash = await bcrypt.hash(rollStr, 10);

        const user = await User.create({
          username: rollStr,
          passwordHash,
          role: 'student',
          name: rollStr
        });

        const student = await Student.create({
          user: user._id,
          roll: rollStr,
          section: range.section,
          year: 3
        });

        studentDocs[rollStr] = student;

        // Enroll in core subjects
        for (const coreSub of coreSubjects) {
          await Enrollment.create({
            student: student._id,
            subject: subjectDocs[coreSub.code]._id,
            chosenAsElective: false
          });
        }

        // Enroll in elective
        const isCyberSecurity = cyberSecurityStudents.includes(roll);
        const electiveCode = isCyberSecurity ? '22CIE55' : '22ITE06';
        await Enrollment.create({
          student: student._id,
          subject: subjectDocs[electiveCode]._id,
          chosenAsElective: true
        });

        console.log(`🎓 Created student: ${rollStr} (${range.section}) - Elective: ${electiveCode}`);
      }
    }

    // Create Faculty Assignments based on timetable data
    const assignments = [
      // IT-1 Faculty Assignments
      { faculty: 'Mrs. E. Rama Lakshmi', subject: '22CSC21', sections: ['IT-1'] },
      { faculty: 'Mr. N. Shiva Kumar', subject: '22ITC08', sections: ['IT-1'] },
      { faculty: 'Dr. A. Sirisha', subject: '22CAC17', sections: ['IT-1'] },
      { faculty: 'Dr. B. Harish Goud', subject: '22ITC10', sections: ['IT-1'] },
      { faculty: 'Mr. R. Govardhan Reddy', subject: '22ITC12', sections: ['IT-1'] },
      { faculty: 'Mr. U. Sai Ram', subject: '22CIE55', sections: ['IT-1'] },
      { faculty: 'Mr. R. Sai Venkat', subject: '22ITE06', sections: ['IT-1'] },

      // Lab assignments
      { faculty: 'Mrs. E. Rama Lakshmi', subject: '22CSC23', sections: ['IT-1'], handlesLab: true },
      { faculty: 'Mr. N. Shiva Kumar', subject: '22ITC09', sections: ['IT-1'], handlesLab: true },
      { faculty: 'Dr. B. Harish Goud', subject: '22ITC11', sections: ['IT-1'], handlesLab: true },
      { faculty: 'Dr. A. Sirisha', subject: '22CAC18', sections: ['IT-1'], handlesLab: true },
      { faculty: 'Dr. T. Prathima', subject: '22ITC16', sections: ['IT-1'], handlesLab: true }
    ];

    for (const assignment of assignments) {
      if (facultyDocs[assignment.faculty] && subjectDocs[assignment.subject]) {
        await FacultyAssignment.create({
          faculty: facultyDocs[assignment.faculty]._id,
          subject: subjectDocs[assignment.subject]._id,
          sections: assignment.sections,
          handlesLab: assignment.handlesLab || false
        });
        console.log(`📋 Created assignment: ${assignment.faculty} -> ${assignment.subject}`);
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Subjects: ${allSubjects.length}`);
    console.log(`   - Faculty: ${facultyData.length}`);
    console.log(`   - Students: ${Object.keys(studentDocs).length}`);
    console.log(`   - Cyber Security students: ${cyberSecurityStudents.length}`);

    mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedData();
