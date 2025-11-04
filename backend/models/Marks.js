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
  slipTest1: { type: Number, default: null },
  slipTest2: { type: Number, default: null },
  slipTest3: { type: Number, default: null },
  assignment1: { type: Number, default: null },
  assignment2: { type: Number, default: null },
  classTest1: { type: Number, default: null },
  classTest2: { type: Number, default: null },
  attendance: { type: Number, default: null },

  // Lab subject marks
  weeklyCIE1: { type: Number, default: null },
  weeklyCIE2: { type: Number, default: null },
  weeklyCIE3: { type: Number, default: null },
  weeklyCIE4: { type: Number, default: null },
  weeklyCIE5: { type: Number, default: null },
  weeklyCIE6: { type: Number, default: null },
  weeklyCIE7: { type: Number, default: null },
  weeklyCIE8: { type: Number, default: null },
  weeklyCIE9: { type: Number, default: null },
  weeklyCIE10: { type: Number, default: null },
  internalTest1: { type: Number, default: null },
  internalTest2: { type: Number, default: null },

  // Attendance marks (applicable to both theory and lab)
  // (kept as single field above)

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
