import mongoose from "mongoose";
import { StudentMarksHybrid } from "./models/studentmarks.hybrid.model.js";

await mongoose.connect("mongodb://127.0.0.1:27017/marks_management");

// Example marks data (replace with your actual marks data)
const marksData = [
  {
    classCode: "IT3-22ITE12",
    rollNo: "160123737141",
    name: "AMJA MAITHILI",
    slipTests: [5, 5, 4.5],
    slipTestAverage: 5,
    assignments: [10, 9],
    assignmentAverage: 9.5,
    classTests: [18, 20],
    classTestAverage: 19,
    attendanceMarks: 5,
    totalMarks: 38.5,
    remarks: "Excellent performance"
  },
  {
    classCode: "IT3-22ITE12",
    rollNo: "160123737142",
    name: "AVANI CHETLURI",
    slipTests: [4, 5, 4.5],
    slipTestAverage: 4.75,
    assignments: [9, 8],
    assignmentAverage: 8.5,
    classTests: [17, 19],
    classTestAverage: 18,
    attendanceMarks: 4,
    totalMarks: 35.25,
    remarks: "Good progress"
  }
  // ...add marks for all students and classes
];

await StudentMarksHybrid.insertMany(marksData);
console.log("✅ Student marks seeded!");
process.exit();
