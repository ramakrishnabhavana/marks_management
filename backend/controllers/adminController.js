import Department from '../models/Department.js';
import Subject from '../models/Subject.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import User from '../models/User.js';

// Department CRUD
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('hod', 'name email')
      .populate('subjects', 'name code')
      .populate('faculty', 'name email designation')
      .populate({
        path: 'classes.students',
        select: 'name rollNo'
      });

    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
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
      select: 'name rollNo'
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
        select: 'name rollNo'
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
      select: 'name rollNo'
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
      select: 'name rollNo'
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
