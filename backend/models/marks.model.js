import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  marksObtained: { type: Number, required: true },
  remarks: { type: String },
  enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // faculty userId
  updatedAt: { type: Date, default: Date.now }
});

markSchema.index({ student: 1, test: 1 }, { unique: true }); // one mark per student/test

export const Mark = mongoose.model('Mark', markSchema);
