import mongoose from 'mongoose';

const facultyAssignmentSchema = new mongoose.Schema({
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  sections: [String], // e.g., ['IT-3-B1','IT-3-B2'] or ['B1','B2','B3']
  handlesLab: { type: Boolean, default: false } // true if faculty handles lab too
});

export const FacultyAssignment = mongoose.model('FacultyAssignment', facultyAssignmentSchema);
