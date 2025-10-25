import mongoose from "mongoose";
import { FacultyHybrid } from "./models/faculty.hybrid.model.js";

await mongoose.connect("mongodb://127.0.0.1:27017/marks_management");

const facultyData = [
  {
    facultyId: "FAC001",
    name: "Dr. D. Jayaram",
    password: "Dr. D. Jayaram",
    department: "Information Technology",
    email: "",
    classesTaught: [
      { classCode: "IT1-22ITE12", className: "IT 1st Year", subjectCode: "22ITE12", subjectName: "PP-1", semester: 1, credits: 3 },
      { classCode: "IT2-22ITE12", className: "IT 2nd Year", subjectCode: "22ITE12", subjectName: "PP-1", semester: 2, credits: 3 },
      { classCode: "IT3-22ITE12", className: "IT 3rd Year", subjectCode: "22ITE12", subjectName: "PP-1", semester: 3, credits: 3 }
    ]
  },
  {
    facultyId: "FAC002",
    name: "Dr. Kolikipogu Ramakrishna",
    password: "Dr. Kolikipogu Ramakrishna",
    department: "Information Technology",
    email: "",
    classesTaught: [
      { classCode: "IT1-22ITC26", className: "IT 1st Year", subjectCode: "22ITC26", subjectName: "Project Part–1", semester: 1, credits: 3 }
    ]
  },
  {
    facultyId: "FAC003",
    name: "Dr. G. Sagar",
    password: "Dr. G. Sagar",
    department: "Information Technology",
    email: "",
    classesTaught: [
      { classCode: "IT1-22ITC26", className: "IT 1st Year", subjectCode: "22ITC26", subjectName: "Project Part–1", semester: 1, credits: 3 }
    ]
  }
  // ...continue for all faculty and classes as per your data
];

await FacultyHybrid.insertMany(facultyData);
console.log("✅ Faculty data seeded!");
process.exit();
