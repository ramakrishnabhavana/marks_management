import dotenv from 'dotenv';
import mongoose from 'mongoose';
import FacultyAssignment from '../models/FacultyAssignment.js';
import Enrollment from '../models/Enrollment.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import Subject from '../models/Subject.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/marks_management';

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: undefined });
    console.log('Connected to', mongoose.connection.host, mongoose.connection.name);

    const faCount = await FacultyAssignment.countDocuments();
    const enCount = await Enrollment.countDocuments();

    console.log(`FacultyAssignment count: ${faCount}`);
    console.log(`Enrollment count: ${enCount}`);

    const faSamples = await FacultyAssignment.find().limit(10)
      .populate('faculty', 'name email')
      .populate('subject', 'code name')
      .lean();

    const enSamples = await Enrollment.find().limit(10)
      .populate('student', 'rollNo name section')
      .populate('subject', 'code name')
      .populate('faculty', 'name')
      .lean();

    console.log('\n--- FacultyAssignment samples (up to 10) ---');
    if (faSamples.length === 0) console.log('  (none)');
    faSamples.forEach((f, i) => {
      console.log(`${i+1}. id:${f._id} faculty:${f.faculty?.name} subject:${f.subject?.code} sections:${JSON.stringify(f.sections)} semester:${f.semester}`);
    });

    console.log('\n--- Enrollment samples (up to 10) ---');
    if (enSamples.length === 0) console.log('  (none)');
    enSamples.forEach((e, i) => {
      console.log(`${i+1}. id:${e._id} student:${e.student?.rollNo}:${e.student?.name} section:${e.section} subject:${e.subject?.code}`);
    });

    // If counts > 0 but samples empty, warn
    if (faCount > 0 && faSamples.length === 0) console.log('\nWarning: faculty assignment count >0 but no samples returned.');
    if (enCount > 0 && enSamples.length === 0) console.log('\nWarning: enrollment count >0 but no samples returned.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error while inspecting DB:', err);
    process.exit(2);
  }
};

run();
