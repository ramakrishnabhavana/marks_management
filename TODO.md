# Admin Dashboard Enhancement TODO

## Backend Changes
- [x] Update Subject model: Add 'abbreviation' field
- [x] Update Faculty model: Change 'designation' to 'role', add 'facultyId' field
- [x] Update adminController: Handle abbreviation in addSubjectToDepartment
- [x] Update adminController: Handle facultyId and role in addFacultyToDepartment
- [x] Add student creation endpoint: createStudentAndAddToClass

## Frontend Changes
- [x] Update AdminDashboard: Change faculty form to use 'role' and add 'facultyId'
- [x] Update AdminDashboard: Add student addition dialog to class cards
- [x] Update api.js: Add method for creating students and adding to class

## Testing
- [x] Test subject creation with abbreviation
- [x] Test faculty creation with facultyId and role
- [x] Test student addition to classes
