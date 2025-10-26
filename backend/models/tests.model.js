import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  name: { type: String, required: true }, // e.g., "Mid 1", "Assignment 1", "Lab Exam"
  type: { type: String, enum: ['theory', 'lab', 'assignment', 'quiz', 'ct', 'final'], default: 'theory' },
  maxMarks: { type: Number, required: true },
  date: { type: Date },
  session: { type: String }, // e.g., "Odd 2025"
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export const Test = mongoose.model('Test', testSchema);
