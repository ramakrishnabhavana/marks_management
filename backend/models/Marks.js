import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  semester: { type: Number, required: true },
  section: { type: String, required: true },

  // Theory Components
  slipTests: [{
    testNumber: Number,
    marks: Number,
    maxMarks: { type: Number, default: 10 },
    date: Date,
    topic: String
  }],
  assignments: [{
    assignmentNumber: Number,
    marks: Number,
    maxMarks: { type: Number, default: 10 },
    date: Date,
    topic: String
  }],
  internalTests: [{
    testNumber: Number,
    marks: Number,
    maxMarks: { type: Number, default: 20 },
    date: Date,
    topic: String
  }],

  // Lab Components
  labRecords: [{
    experiment: String,
    marks: Number,
    maxMarks: { type: Number, default: 5 },
    date: Date
  }],
  labTests: [{
    testNumber: Number,
    marks: Number,
    maxMarks: { type: Number, default: 10 },
    date: Date
  }],

  // Attendance
  attendance: {
    classesHeld: { type: Number, default: 0 },
    classesAttended: { type: Number, default: 0 },
    percentage: Number,
    marks: { type: Number, default: 0 }
  },

  // Calculated fields
  totalCieMarks: { type: Number, default: 0 },
  grade: String,
  remarks: String,

  // Metadata
  enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for performance
marksSchema.index({ student: 1, subject: 1 }, { unique: true });
marksSchema.index({ faculty: 1, semester: 1 });
marksSchema.index({ section: 1, subject: 1 });

// Calculate totals before saving
marksSchema.pre('save', function(next) {
  // Calculate slip test average
  const slipTestAvg = this.slipTests.length > 0
    ? this.slipTests.reduce((sum, st) => sum + st.marks, 0) / this.slipTests.length
    : 0;

  // Calculate assignment average
  const assignmentAvg = this.assignments.length > 0
    ? this.assignments.reduce((sum, a) => sum + a.marks, 0) / this.assignments.length
    : 0;

  // Calculate internal test average
  const internalTestAvg = this.internalTests.length > 0
    ? this.internalTests.reduce((sum, it) => sum + it.marks, 0) / this.internalTests.length
    : 0;

  // Calculate lab components
  const labRecordTotal = this.labRecords.reduce((sum, lr) => sum + lr.marks, 0);
  const labTestTotal = this.labTests.reduce((sum, lt) => sum + lt.marks, 0);

  // Calculate attendance marks (5 marks for 75%+ attendance)
  const attendancePercentage = (this.attendance.classesAttended / this.attendance.classesHeld) * 100 || 0;
  this.attendance.percentage = attendancePercentage;
  this.attendance.marks = attendancePercentage >= 75 ? 5 : 0;

  // Calculate total CIE marks
  this.totalCieMarks = slipTestAvg + assignmentAvg + internalTestAvg +
                      labRecordTotal + labTestTotal + this.attendance.marks;

  // Calculate grade
  if (this.totalCieMarks >= 36) this.grade = 'A';
  else if (this.totalCieMarks >= 32) this.grade = 'B';
  else if (this.totalCieMarks >= 28) this.grade = 'C';
  else if (this.totalCieMarks >= 24) this.grade = 'D';
  else this.grade = 'F';

  next();
});

export const Marks = mongoose.model('Marks', marksSchema);
