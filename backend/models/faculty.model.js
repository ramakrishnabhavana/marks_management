import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjects: [{
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    class: { type: String, required: true }
  }]
}, { timestamps: true });

export const Faculty = mongoose.model('Faculty', facultySchema);
