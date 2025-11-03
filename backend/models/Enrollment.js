import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  section: { type: String, required: true },
  semester: { type: Number, required: true },
  chosenAsElective: { type: Boolean, default: false },
  electiveGroup: String,
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }
}, { timestamps: true });

enrollmentSchema.index({ student: 1, subject: 1 }, { unique: true });

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
