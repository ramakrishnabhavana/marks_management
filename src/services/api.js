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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
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

  async uploadBulkMarks(classCode, markType, marks) {
    return this.request(`/faculty/classes/${classCode}/marks/bulk`, {
      method: 'POST',
      body: { markType, marks },
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
