import mongoose from 'mongoose';

const facultyAssignmentSchema = new mongoose.Schema({
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  sections: [{ type: String, required: true }],
  semester: { type: Number, required: true },
  handlesLab: { type: Boolean, default: false },
  isElective: { type: Boolean, default: false },
  electiveGroup: String
}, { timestamps: true });

facultyAssignmentSchema.index({ faculty: 1, subject: 1, section: 1 });

export const FacultyAssignment = mongoose.model('FacultyAssignment', facultyAssignmentSchema);
