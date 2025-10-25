import mongoose from 'mongoose';


const facultyHybridSchema = new mongoose.Schema({
  facultyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String },
  email: { type: String },
  password: { type: String, required: true },
  classesTaught: [
    {
      classCode: String,
      className: String,
      subjectCode: String,
      subjectName: String,
      semester: Number,
      credits: Number
    }
  ]
}, { timestamps: true });

export const FacultyHybrid = mongoose.model('FacultyHybrid', facultyHybridSchema);
