import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  section: { type: String, required: true, enum: ['IT-1', 'IT-2', 'IT-3'] },
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  department: { type: String, default: 'Information Technology' },
  contact: {
    email: String,
    phone: String
  },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }
}, { timestamps: true });

export const Student = mongoose.model('Student', studentSchema);
