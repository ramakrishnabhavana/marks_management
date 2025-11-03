import mongoose from "mongoose";
import { User } from "./models/user.model.js";

await mongoose.connect("mongodb://127.0.0.1:27017/marks_management");

// Example student list (replace with your actual student data)
const students = [
  { username: "160123737141", name: "AMJA MAITHILI", role: "student", passwordHash: "160123737141", email: "160123737141@it1.com" },
  { username: "160123737142", name: "AVANI CHETLURI", role: "student", passwordHash: "160123737142", email: "160123737142@it1.com" },
  // Add more students as needed
];

await User.insertMany(students);
console.log("✅ Student accounts seeded!");
process.exit();
