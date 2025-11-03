import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['theory', 'lab'],
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  maxMarks: {
    cie: {
      type: Number,
      default: function() {
        return this.type === 'theory' ? 40 : 50;
      }
    },
    see: {
      type: Number,
      default: function() {
        return this.type === 'theory' ? 60 : 50;
      }
    }
  },
}, {
  timestamps: true,
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
