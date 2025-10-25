import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  credits: { type: Number, required: true },
  type: { type: String, enum: ["Theory", "Lab"], required: true }
});

export const Subject = mongoose.model("Subject", subjectSchema);