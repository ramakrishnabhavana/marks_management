import mongoose from "mongoose";
import { Student } from "./models/student.model.js";

await mongoose.connect("mongodb://127.0.0.1:27017/marks_management");

// Example student list (replace with your actual student data)
const students = [
  { rollNo: "160123737141", name: "AMJA MAITHILI", class: "IT1", password: "160123737141" },
  { rollNo: "160123737142", name: "AVANI CHETLURI", class: "IT1", password: "160123737142" },
  // ...add all students for IT1, IT2, IT3
];

await Student.insertMany(students);
console.log("✅ Student accounts seeded!");
process.exit();
