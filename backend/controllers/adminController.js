import Department from '../models/Department.js';
import Subject from '../models/Subject.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import * as XLSX from 'xlsx';

// Department CRUD
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('hod', 'name email')
      .populate('subjects', 'name code abbreviation credits type semester')
      .populate('faculty', 'name email role facultyId mobile')
      .populate({
        path: 'classes.students',
        select: 'name rollNo email mobile'
      });

    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk upload subjects from Excel
export const bulkAddSubjects = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { semester } = req.body; // Semester from form
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const subjects = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const subjectData = {
        code: row.Code?.toString().trim(),
        name: row.Subject?.toString().trim(),
        abbreviation: row.Abbreviation?.toString().trim(),
        credits: parseInt(row.Credits),
        type: row['Theory/Lab']?.toString().toLowerCase().trim() === 'lab' ? 'lab' : 'theory',
        semester: parseInt(semester),
        department: departmentId,
      };

      // Validate required fields
      if (!subjectData.code || !subjectData.name || !subjectData.abbreviation || isNaN(subjectData.credits)) {
        errors.push(`Row ${i + 2}: Missing or invalid required fields`);
        continue;
      }

      try {
        const subject = new Subject(subjectData);
        await subject.save();
        subjects.push(subject);
      } catch (error) {
        if (error.code === 11000) {
          errors.push(`Row ${i + 2}: Subject code '${subjectData.code}' already exists`);
        } else {
          errors.push(`Row ${i + 2}: ${error.message}`);
        }
      }
    }

    // Add subjects to department
    if (subjects.length > 0) {
      await Department.findByIdAndUpdate(departmentId, {
        $push: { subjects: { $each: subjects.map(s => s._id) } }
      });
    }

    res.status(201).json({
      message: `Successfully added ${subjects.length} subjects`,
      added: subjects.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Bulk add subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk upload faculty from Excel
export const bulkAddFaculty = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const faculty = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const facultyData = {
        name: row.Name?.toString().trim(),
        facultyId: row.FacultyId?.toString().trim(),
        role: row.Role?.toString().trim(),
        email: row.Email?.toString().trim(),
        mobile: row.PhoneNumber?.toString().trim(),
      };

      // Validate required fields
      if (!facultyData.name || !facultyData.facultyId || !facultyData.role || !facultyData.email) {
        errors.push(`Row ${i + 2}: Missing required fields (Name, FacultyId, Role, Email)`);
        continue;
      }

      try {
        // Create user account
        const user = new User({
          username: facultyData.email,
          email: facultyData.email,
          password: 'faculty123',
          name: facultyData.name,
          role: 'faculty',
        });
        await user.save();

        // Create faculty profile
        const facultyProfile = new Faculty({
          user: user._id,
          facultyId: facultyData.facultyId,
          name: facultyData.name,
          email: facultyData.email,
          mobile: facultyData.mobile,
          department: departmentId,
          role: facultyData.role,
        });
        await facultyProfile.save();

        faculty.push(facultyProfile);
      } catch (error) {
        if (error.code === 11000) {
          errors.push(`Row ${i + 2}: Faculty email or ID already exists`);
        } else {
          errors.push(`Row ${i + 2}: ${error.message}`);
        }
      }
    }

    // Add faculty to department
    if (faculty.length > 0) {
      await Department.findByIdAndUpdate(departmentId, {
        $push: { faculty: { $each: faculty.map(f => f._id) } }
      });
    }

    res.status(201).json({
      message: `Successfully added ${faculty.length} faculty members`,
      added: faculty.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Bulk add faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk upload students from Excel
export const bulkAddStudents = async (req, res) => {
  try {
    const { departmentId, classId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get department and class details
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const classItem = department.classes.id(classId);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const students = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const studentData = {
        name: row.Name?.toString().trim(),
        rollNo: row.RollNumber?.toString().trim(),
        email: row.Email?.toString().trim(),
        mobile: row.PhoneNumber?.toString().trim(),
      };

      // Validate required fields
      if (!studentData.name || !studentData.rollNo || !studentData.email) {
        errors.push(`Row ${i + 2}: Missing required fields (Name, RollNumber, Email)`);
        continue;
      }

      try {
        // Create user account
        const user = new User({
          username: studentData.rollNo,
          email: studentData.email,
          password: 'student123',
          name: studentData.name,
          role: 'student',
        });
        await user.save();

        // Create student profile
        const student = new Student({
          user: user._id,
          rollNo: studentData.rollNo,
          name: studentData.name,
          section: classItem.section,
          year: classItem.year,
          semester: classItem.semester,
          department: department.code,
          contact: {
            email: studentData.email,
            mobile: studentData.mobile,
          },
        });
        await student.save();

        students.push(student);
      } catch (error) {
        if (error.code === 11000) {
          errors.push(`Row ${i + 2}: Student roll number or email already exists`);
        } else {
          errors.push(`Row ${i + 2}: ${error.message}`);
        }
      }
    }

    // Add students to class
    if (students.length > 0) {
      await Department.findOneAndUpdate(
        { _id: departmentId, 'classes._id': classId },
        { $push: { 'classes.$.students': { $each: students.map(s => s._id) } } },
        { new: true }
      ).populate({
        path: 'classes.students',
        select: 'name rollNo email mobile'
      });
    }

    res.status(201).json({
      message: `Successfully added ${students.length} students`,
      added: students.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Bulk add students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name, code, hod } = req.body;

    const department = new Department({
      name,
      code,
      hod,
    });

    await department.save();

    const populatedDepartment = await Department.findById(department._id)
      .populate('hod', 'name email');

    res.status(201).json(populatedDepartment);
  } catch (error) {
    console.error('Create department error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Department name or code already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const department = await Department.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('hod', 'name email')
      .populate('subjects', 'name code')
      .populate('faculty', 'name email designation');

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByIdAndDelete(id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Subject CRUD within departments
export const addSubjectToDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { code, name, abbreviation, credits, type, semester } = req.body;

    const subject = new Subject({
      code,
      name,
      abbreviation,
      credits,
      type,
      semester,
      department: departmentId,
    });

    await subject.save();

    // Add subject to department
    await Department.findByIdAndUpdate(departmentId, {
      $push: { subjects: subject._id }
    });

    const populatedSubject = await Subject.findById(subject._id);

    res.status(201).json(populatedSubject);
  } catch (error) {
    console.error('Add subject error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Subject code already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export const getDepartmentSubjects = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const subjects = await Subject.find({ department: departmentId });

    res.json(subjects);
  } catch (error) {
    console.error('Get department subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Faculty CRUD within departments
export const addFacultyToDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { name, email, mobile, role, facultyId } = req.body;

    // Create user account for faculty
    const user = new User({
      username: email,
      email,
      password: 'faculty123', // Default password
      name,
      role: 'faculty',
    });

    await user.save();

    // Create faculty profile
    const faculty = new Faculty({
      user: user._id,
      facultyId,
      name,
      email,
      mobile,
      department: departmentId,
      role,
    });

    await faculty.save();

    // Add faculty to department
    await Department.findByIdAndUpdate(departmentId, {
      $push: { faculty: faculty._id }
    });

    const populatedFaculty = await Faculty.findById(faculty._id)
      .populate('user', 'username email');

    res.status(201).json(populatedFaculty);
  } catch (error) {
    console.error('Add faculty error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Faculty email already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export const getDepartmentFaculty = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const faculty = await Faculty.find({ department: departmentId })
      .populate('user', 'username email')
      .populate('subjects', 'name code');

    res.json(faculty);
  } catch (error) {
    console.error('Get department faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Class/Section management
export const addClassToDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { section, year, semester, students } = req.body;

    const classData = {
      section,
      year,
      semester,
      students: students || [],
    };

    const department = await Department.findByIdAndUpdate(
      departmentId,
      { $push: { classes: classData } },
      { new: true }
    ).populate({
      path: 'classes.students',
      select: 'name rollNo email mobile'
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const addedClass = department.classes[department.classes.length - 1];

    res.status(201).json(addedClass);
  } catch (error) {
    console.error('Add class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDepartmentClasses = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId)
      .populate({
        path: 'classes.students',
        select: 'name rollNo email mobile'
      });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(department.classes);
  } catch (error) {
    console.error('Get department classes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addStudentsToClass = async (req, res) => {
  try {
    const { departmentId, classId } = req.params;
    const { students } = req.body;

    const department = await Department.findOneAndUpdate(
      { _id: departmentId, 'classes._id': classId },
      { $push: { 'classes.$.students': { $each: students } } },
      { new: true }
    ).populate({
      path: 'classes.students',
      select: 'name rollNo email mobile'
    });

    if (!department) {
      return res.status(404).json({ message: 'Department or class not found' });
    }

    const updatedClass = department.classes.id(classId);

    res.json(updatedClass);
  } catch (error) {
    console.error('Add students to class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create student and add to class
export const createStudentAndAddToClass = async (req, res) => {
  try {
    const { departmentId, classId } = req.params;
    const { name, rollNo, email, mobile } = req.body;

    // Get department to find class details
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const classItem = department.classes.id(classId);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Create user account for student
    const user = new User({
      username: rollNo,
      email,
      password: 'student123', // Default password
      name,
      role: 'student',
    });

    await user.save();

    // Create student profile
    const student = new Student({
      user: user._id,
      rollNo,
      name,
      section: classItem.section,
      year: classItem.year,
      semester: classItem.semester,
      department: department.code,
      contact: {
        email,
        mobile,
      },
    });

    await student.save();

    // Add student to class
    const updatedDepartment = await Department.findOneAndUpdate(
      { _id: departmentId, 'classes._id': classId },
      { $push: { 'classes.$.students': student._id } },
      { new: true }
    ).populate({
      path: 'classes.students',
      select: 'name rollNo email mobile'
    });

    const updatedClass = updatedDepartment.classes.id(classId);

    res.status(201).json(updatedClass);
  } catch (error) {
    console.error('Create student and add to class error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Student roll number or email already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Delete subject from department
export const deleteSubjectFromDepartment = async (req, res) => {
  try {
    const { departmentId, subjectId } = req.params;

    // Check if subject exists and belongs to department
    const subject = await Subject.findOne({ _id: subjectId, department: departmentId });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found in this department' });
    }

    // Remove subject from department
    await Department.findByIdAndUpdate(departmentId, {
      $pull: { subjects: subjectId }
    });

    // Delete the subject
    await Subject.findByIdAndDelete(subjectId);

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete faculty from department
export const deleteFacultyFromDepartment = async (req, res) => {
  try {
    const { departmentId, facultyId } = req.params;

    // Check if faculty exists and belongs to department
    const faculty = await Faculty.findOne({ _id: facultyId, department: departmentId });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found in this department' });
    }

    // Remove faculty from department
    await Department.findByIdAndUpdate(departmentId, {
      $pull: { faculty: facultyId }
    });

    // Delete the faculty profile
    await Faculty.findByIdAndDelete(facultyId);

    // Delete the associated user account
    await User.findByIdAndDelete(faculty.user);

    res.json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    console.error('Delete faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete student from class
export const deleteStudentFromClass = async (req, res) => {
  try {
    const { departmentId, classId, studentId } = req.params;

    // Check if student exists in the class
    const department = await Department.findOne({
      _id: departmentId,
      'classes._id': classId,
      'classes.students': studentId
    });

    if (!department) {
      return res.status(404).json({ message: 'Student not found in this class' });
    }

    // Remove student from class
    await Department.findOneAndUpdate(
      { _id: departmentId, 'classes._id': classId },
      { $pull: { 'classes.$.students': studentId } }
    );

    // Delete the student profile
    const student = await Student.findById(studentId);
    if (student) {
      await Student.findByIdAndDelete(studentId);
      // Delete the associated user account
      await User.findByIdAndDelete(student.user);
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
