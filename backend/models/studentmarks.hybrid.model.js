import mongoose from "mongoose";

const studentMarksSchema = new mongoose.Schema({
  classCode: { type: String, required: true },
  rollNo: { type: String, required: true },
  name: String,
  slipTests: [Number],
  slipTestAverage: Number,
  assignments: [Number],
  assignmentAverage: Number,
  classTests: [Number],
  classTestAverage: Number,
  attendanceMarks: Number,
  totalMarks: Number,
  remarks: String
});

studentMarksSchema.index({ classCode: 1, rollNo: 1 }, { unique: true });

export const StudentMarksHybrid = mongoose.model("StudentMarksHybrid", studentMarksSchema);
