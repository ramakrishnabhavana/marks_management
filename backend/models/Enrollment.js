import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  chosenAsElective: {
    type: Boolean,
    default: false,
  },
  electiveGroup: {
    type: String,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ student: 1, subject: 1, semester: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
