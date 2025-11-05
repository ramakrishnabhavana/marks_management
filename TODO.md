# TODO: Implement Excel Upload for Faculty Marks

## Backend Changes
- [x] Install multer and xlsx dependencies in backend/package.json
- [x] Add uploadExcelMarks function in backend/controllers/facultyController.js
- [x] Add POST /faculty/marks/upload-excel route in backend/routes/facultyRoutes.js

## Frontend Changes
- [x] Add uploadExcelMarks method in src/services/api.js
- [x] Update FacultyDashboard.jsx to include Excel file upload UI in the upload tab
- [x] Handle file selection, markType selection, and upload process

## Testing
- [ ] Test Excel parsing and data saving to MongoDB
- [ ] Verify error handling for invalid files or data
