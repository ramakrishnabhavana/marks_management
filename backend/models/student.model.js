import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNo: { type: String, required: true, unique: true },
  class: { type: String, required: true },
  password: { type: String, required: true },
  subjects: [{
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    marks: {
      slipTests: [Number],
      assignments: [Number],
      classTests: [Number],
      attendance: Number,
      weeklyCIE: [Number],
      internalTests: [Number]
    }
  }]
}, { timestamps: true });

export const Student = mongoose.model('Student', studentSchema);
