import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // used as identifier per your instructions
  email: { type: String },
  mobile: { type: String },
});

export const Faculty = mongoose.model('Faculty', facultySchema);
