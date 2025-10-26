import mongoose from "mongoose";
import { User } from "./models/user.model.js";

await mongoose.connect("mongodb://127.0.0.1:27017/marks_management");

// Example student list (replace with your actual student data)
const students = [
  { email: "160123737141@it1.com", name: "AMJA MAITHILI", role: "student", password: "160123737141", rollNo: "160123737141" },
  { email: "160123737142@it1.com", name: "AVANI CHETLURI", role: "student", password: "160123737142", rollNo: "160123737142" },
  // Add more students as needed
];

await User.insertMany(students);
console.log("✅ Student accounts seeded!");
process.exit();
