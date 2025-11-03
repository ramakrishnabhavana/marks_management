import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // roll for students, name for faculty
  password: { type: String, required: true }, // store plain text password
  role: { type: String, enum: ['student', 'faculty', 'admin'], required: true },
  name: { type: String }, // full name (for faculties this will be their name)
  email: { type: String, unique: false },
  createdAt: { type: Date, default: Date.now }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return this.password === candidatePassword;
};

export const User = mongoose.model('User', userSchema);
