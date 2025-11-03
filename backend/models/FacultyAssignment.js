import mongoose from 'mongoose';

const facultyAssignmentSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  sections: [{
    type: String,
    required: true,
  }],
  semester: {
    type: Number,
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate assignments
facultyAssignmentSchema.index({ faculty: 1, subject: 1, semester: 1 }, { unique: true });

const FacultyAssignment = mongoose.model('FacultyAssignment', facultyAssignmentSchema);

export default FacultyAssignment;
