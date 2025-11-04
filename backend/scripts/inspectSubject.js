import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Subject from '../models/Subject.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/marks_management';

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');
    const subj = await Subject.find({}).limit(50).lean();
    console.log('Total subjects:', subj.length);
    subj.forEach((s,i)=>{
      console.log(i+1, s.code, '-', s.name);
    });
    const specific = await Subject.findOne({ code: '22CIE55' }).lean();
    console.log('\nLookup 22CIE55 ->', specific ? 'FOUND' : 'NOT FOUND');
    if (specific) console.log(specific);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(2);
  }
};

run();
