
import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  classCode: { type: String, required: true, unique: true },
  className: String,
  subjectCode: String,
  subjectName: String,
  facultyId: String,
  semester: Number,
  credits: Number,
  totalClasses: Number,
  students: [
    {
      rollNo: String,
      name: String
    }
  ]
});

export const ClassHybrid = mongoose.model("ClassHybrid", classSchema);
