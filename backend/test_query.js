import mongoose from 'mongoose';

await mongoose.connect("mongodb://127.0.0.1:27017/marks_management");

const Enrollment = mongoose.model('Enrollment', new mongoose.Schema({
  student: mongoose.Schema.Types.ObjectId,
  subject: mongoose.Schema.Types.ObjectId,
  chosenAsElective: Boolean
}));

const Subject = mongoose.model('Subject', new mongoose.Schema({
  code: String,
  name: String
}));

const Student = mongoose.model('Student', new mongoose.Schema({
  roll: String,
  section: String,
  user: mongoose.Schema.Types.ObjectId
}));

const FacultyAssignment = mongoose.model('FacultyAssignment', new mongoose.Schema({
  faculty: mongoose.Schema.Types.ObjectId,
  subject: mongoose.Schema.Types.ObjectId,
  sections: [String],
  handlesLab: Boolean
}));

const Faculty = mongoose.model('Faculty', new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  name: String
}));

const faculty = await Faculty.findOne({ name: 'Mrs. E. Rama Lakshmi' });
console.log('Faculty found:', faculty ? faculty.name : 'No');

const assignment = await FacultyAssignment.findOne({ faculty: faculty._id }).populate({ path: 'subject', model: Subject });
console.log('Assignment subject:', assignment.subject.code, 'Sections:', assignment.sections);

const studentIds = await Student.find({ section: { $in: assignment.sections } }).distinct('_id');
console.log('Student IDs found:', studentIds.length);

const enrollments = await Enrollment.find({
  subject: assignment.subject._id,
  student: { $in: studentIds }
}).populate({ path: 'student', model: Student });

console.log('Enrollments found:', enrollments.length);

process.exit();
