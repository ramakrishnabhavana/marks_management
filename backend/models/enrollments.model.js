import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  chosenAsElective: { type: Boolean, default: false }, // true if this was the elective chosen
});

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
