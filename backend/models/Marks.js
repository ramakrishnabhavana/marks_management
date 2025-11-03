import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Theory subject marks
  slipTests: [{
    testNumber: Number,
    marks: Number,
    maxMarks: { type: Number, default: 5 },
    date: { type: Date, default: Date.now },
    topic: String,
  }],
  assignments: [{
    assignmentNumber: Number,
    marks: Number,
    maxMarks: { type: Number, default: 10 },
    date: { type: Date, default: Date.now },
    topic: String,
  }],
  internalTests: [{
    testNumber: Number,
    marks: Number,
    maxMarks: { type: Number, default: 20 },
    date: { type: Date, default: Date.now },
    topic: String,
  }],

  // Lab subject marks
  labRecords: [{
    experiment: String,
    marks: Number,
    maxMarks: { type: Number, default: 5 },
    date: { type: Date, default: Date.now },
  }],
  labTests: [{
    testNumber: Number,
    marks: Number,
    maxMarks: { type: Number, default: 10 },
    date: { type: Date, default: Date.now },
  }],

  // Attendance marks (applicable to both theory and lab)
  attendance: {
    classesHeld: { type: Number, default: 0 },
    classesAttended: { type: Number, default: 0 },
    marks: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },

  // Final assessment
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
  },
  remarks: String,

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index to ensure unique marks per student-subject-semester
marksSchema.index({ student: 1, subject: 1, semester: 1 }, { unique: true });

// Update lastUpdated on save
marksSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

const Marks = mongoose.model('Marks', marksSchema);

export default Marks;
