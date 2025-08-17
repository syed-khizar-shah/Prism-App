// services/frameSummaryAPI.js
const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/frame-summary`; 

class FrameSummaryAPI {
  // Get or create the single frame summary
  static async getFrameSummary() {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch frame summaries');
      const summaries = await response.json();
      
      if (summaries.length > 0) {
        return summaries[0]; // Return the first (and only) summary
      } else {
        // Create a new one if none exists
        return await this.createFrameSummary({});
      }
    } catch (error) {
      throw new Error('Failed to get frame summary');
    }
  }

  static async createFrameSummary(data) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create frame summary');
    return response.json();
  }

  static async updateFrameSummary(id, data) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update frame summary');
    return response.json();
  }

  // Field-specific operations
  static async addField(summaryId, fieldData) {
    const response = await fetch(`${API_BASE_URL}/${summaryId}/fields`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fieldData),
    });
    if (!response.ok) throw new Error('Failed to add field');
    return response.json();
  }

  static async updateField(summaryId, fieldIndex, fieldData) {
    const response = await fetch(`${API_BASE_URL}/${summaryId}/fields/${fieldIndex}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fieldData),
    });
    if (!response.ok) throw new Error('Failed to update field');
    return response.json();
  }

  static async removeField(summaryId, fieldIndex) {
    const response = await fetch(`${API_BASE_URL}/${summaryId}/fields/${fieldIndex}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove field');
    return response.json();
  }
}

export default FrameSummaryAPI;