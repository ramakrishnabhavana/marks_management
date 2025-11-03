import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  department: { type: String, default: 'Information Technology' },
  designation: { type: String, default: 'Assistant Professor' },
  qualifications: [String],
  timetable: {
    Monday: [{
      period: Number,
      subject: String,
      section: String,
      type: String // theory/lab
    }],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: []
  },
  workload: {
    theory: Number,
    practical: Number,
    projects: Number,
    mentor: Number,
    others: Number,
    total: Number
  }
}, { timestamps: true });

export const Faculty = mongoose.model('Faculty', facultySchema);
