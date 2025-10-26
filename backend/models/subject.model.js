import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // like 22ITC04
  name: { type: String, required: true },
  isElective: { type: Boolean, default: false },
  electivesGroup: { type: String }, // e.g., "PE-2" or "CSvsSPM"
});

export const Subject = mongoose.model("Subject", subjectSchema);
