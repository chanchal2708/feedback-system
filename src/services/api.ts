const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = response.access_token;
    localStorage.setItem('authToken', this.token!);
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Feedback methods
  async createFeedback(feedbackData: any) {
    return this.request('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async getGivenFeedback() {
    return this.request('/feedback/given');
  }

  async getReceivedFeedback() {
    return this.request('/feedback/received');
  }

  async updateFeedback(feedbackId: string, updates: any) {
    return this.request(`/feedback/${feedbackId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async acknowledgeFeedback(feedbackId: string) {
    return this.request(`/feedback/${feedbackId}/acknowledge`, {
      method: 'PUT',
    });
  }

  // Dashboard methods
  async getManagerDashboard() {
    return this.request('/dashboard/manager');
  }

  async getEmployeeDashboard() {
    return this.request('/dashboard/employee');
  }

  // Team methods
  async getTeamMembers() {
    return this.request('/users/team');
  }
}

export const apiService = new ApiService();