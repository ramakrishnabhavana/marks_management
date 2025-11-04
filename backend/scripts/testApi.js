import dotenv from 'dotenv';

dotenv.config();

const BASE = `http://localhost:${process.env.PORT || 5000}/api`;

const loginAndTest = async () => {
  try {
    console.log('Logging in as seeded faculty user: u.sairam / password123');

    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'u.sairam', password: 'password123' })
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      console.error('Login failed:', loginData);
      process.exit(2);
    }

    console.log('Login success. Token length:', (loginData.token || '').length);
    const token = loginData.token;

    // Get faculty subjects
    const subjectsRes = await fetch(`${BASE}/faculty/subjects`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const subjectsData = await subjectsRes.json();
    if (!subjectsRes.ok) {
      console.error('Failed to fetch subjects:', subjectsData);
      process.exit(2);
    }

    console.log('\nFaculty subjects response:');
    console.log('Faculty name:', subjectsData.faculty?.name);
    console.log('Subjects count:', subjectsData.subjects?.length);
    if (!subjectsData.subjects || subjectsData.subjects.length === 0) {
      console.error('No subjects found for faculty — aborting');
      process.exit(2);
    }

  const classCode = subjectsData.subjects[0].classCode;
  console.log('Will request students for classCode:', classCode);
  console.log('classCode raw (json):', JSON.stringify(classCode));

    // Request students for that class
    const studentsRes = await fetch(`${BASE}/faculty/classes/${encodeURIComponent(classCode)}/students`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const studentsData = await studentsRes.json();

    console.log('\nStudents endpoint status:', studentsRes.status);
    console.log('Students response summary:');
    if (studentsRes.ok) {
      console.log('Subject:', studentsData.subject?.code, studentsData.subject?.name);
      console.log('Section:', studentsData.section);
      console.log('Student count returned:', studentsData.students?.length);
      console.log('Sample student:', studentsData.students?.[0]);
    } else {
      console.error('Students request failed:', studentsData);
    }

    process.exit(0);
  } catch (err) {
    console.error('Test script error:', err);
    process.exit(2);
  }
};

loginAndTest();
