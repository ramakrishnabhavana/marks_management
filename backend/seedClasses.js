import mongoose from "mongoose";
import { ClassHybrid } from "./models/class.hybrid.model.js";

await mongoose.connect("mongodb://127.0.0.1:27017/marks_management");

// Example student lists (replace with your actual student data)
const it1Students = [
  { rollNo: "160123737141", name: "AMJA MAITHILI" },
  { rollNo: "160123737142", name: "AVANI CHETLURI" },
  // ...add all IT1 students
];
const it2Students = [
  { rollNo: "160123737151", name: "STUDENT NAME" },
  // ...add all IT2 students
];
const it3Students = [
  { rollNo: "160123737161", name: "STUDENT NAME" },
  // ...add all IT3 students
];

const classData = [
  {
    classCode: "IT1-22ITE12",
    className: "IT 1st Year",
    subjectCode: "22ITE12",
    subjectName: "PP-1",
    facultyId: "FAC001",
    semester: 1,
    credits: 3,
    totalClasses: 38,
    students: it1Students
  },
  {
    classCode: "IT2-22ITE12",
    className: "IT 2nd Year",
    subjectCode: "22ITE12",
    subjectName: "PP-1",
    facultyId: "FAC001",
    semester: 2,
    credits: 3,
    totalClasses: 38,
    students: it2Students
  },
  {
    classCode: "IT3-22ITE12",
    className: "IT 3rd Year",
    subjectCode: "22ITE12",
    subjectName: "PP-1",
    facultyId: "FAC001",
    semester: 3,
    credits: 3,
    totalClasses: 38,
    students: it3Students
  }
  // ...continue for all classes and subjects as per your data
];

await ClassHybrid.insertMany(classData);
console.log("✅ Class roster seeded!");
process.exit();
