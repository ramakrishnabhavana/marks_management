const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });

    if (data.token) {
      this.token = data.token;
      localStorage.setItem('token', data.token);
    }

    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Faculty methods
  async getFacultySubjects() {
    return this.request('/faculty/subjects');
  }

  async getClassStudents(classCode) {
    return this.request(`/faculty/classes/${classCode}/students`);
  }

  async uploadBulkMarks(classCode, markType, marksArray) {
    const [subjectCode, section] = classCode.split('-');

    return this.request('/faculty/marks/bulk-update', {
      method: 'POST',
      body: {
        subjectCode,
        section,
        markType,
        marksArray: marksArray.map(mark => ({
          rollNo: mark.rollNo,
          marks: mark.marks
        }))
      },
    });
  }

  // Student methods
  async getStudentProfile() {
    return this.request('/students/profile');
  }

  async getStudentMarks(subjectCode) {
    return this.request(`/students/marks/${subjectCode}`);
  }
}

export const apiService = new ApiService();
