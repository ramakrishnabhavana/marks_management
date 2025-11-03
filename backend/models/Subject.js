import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  credits: { type: Number, required: true },
  type: { type: String, enum: ['theory', 'lab', 'elective'], default: 'theory' },
  semester: { type: Number, required: true },
  department: { type: String, default: 'Information Technology' },
  maxMarks: {
    cie: { type: Number, default: 40 },
    see: { type: Number, default: 60 }
  },
  electivesGroup: String // PE-2, etc.
}, { timestamps: true });

export const Subject = mongoose.model('Subject', subjectSchema);
