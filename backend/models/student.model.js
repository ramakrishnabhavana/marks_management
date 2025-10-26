import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roll: { type: String, required: true, unique: true }, // e.g., 160123737001
  section: { type: String, enum: ['IT-1', 'IT-2', 'IT-3', 'B1', 'B2', 'B3'], required: true },
  year: { type: Number, default: 3 },
  mentor: { type: String }, // mentor name or userId
  // optional profile fields...
});

export const Student = mongoose.model('Student', studentSchema);
