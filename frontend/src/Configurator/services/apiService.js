// apiService.js
const baseUrl = import.meta.env.VITE_APP_BASE_URL || '';

class ApiService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  async fetchData(url) {
    try {
      const response = await fetch(`${this.baseUrl}${url}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  }

  async postData(url, data) {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Post error:', error);
      return [];
    }
  }
}

export default new ApiService();