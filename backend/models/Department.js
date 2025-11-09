import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  hod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
  }],
  faculty: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
  }],
  classes: [{
    section: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    }],
  }],
}, {
  timestamps: true,
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
