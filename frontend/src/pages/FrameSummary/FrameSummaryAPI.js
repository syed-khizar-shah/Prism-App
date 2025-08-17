// services/frameSummaryAPI.js
const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/frame-summary`; 

class FrameSummaryAPI {
  // Get the frame summary singleton
  static async getFrameSummary() {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch frame summary');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to get frame summary');
    }
  }

  // Get all frame summaries (for backward compatibility)
  static async getAllFrameSummaries() {
    try {
      const response = await fetch(`${API_BASE_URL}/all`);
      if (!response.ok) throw new Error('Failed to fetch frame summaries');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to get frame summaries');
    }
  }

  // Create or update the frame summary singleton
  static async createOrUpdateFrameSummary(data) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create/update frame summary');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to create/update frame summary');
    }
  }

  // Update the frame summary singleton
  static async updateFrameSummary(data) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update frame summary');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to update frame summary');
    }
  }

  // Delete the frame summary (resets to default)
  static async deleteFrameSummary() {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to delete frame summary');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to delete frame summary');
    }
  }

  // Field-specific operations (no ID needed - works with singleton)
  static async addField(fieldData) {
    try {
      const response = await fetch(`${API_BASE_URL}/fields`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fieldData),
      });
      if (!response.ok) throw new Error('Failed to add field');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to add field');
    }
  }

  static async updateField(fieldIndex, fieldData) {
    try {
      const response = await fetch(`${API_BASE_URL}/fields/${fieldIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fieldData),
      });
      if (!response.ok) throw new Error('Failed to update field');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to update field');
    }
  }

  static async removeField(fieldIndex) {
    try {
      const response = await fetch(`${API_BASE_URL}/fields/${fieldIndex}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to remove field');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to remove field');
    }
  }

  // Reorder fields
  static async reorderFields(fieldOrders) {
    try {
      const response = await fetch(`${API_BASE_URL}/fields/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fieldOrders }),
      });
      if (!response.ok) throw new Error('Failed to reorder fields');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to reorder fields');
    }
  }

  // Helper methods
  static async getActiveFields() {
    try {
      const summary = await this.getFrameSummary();
      return summary.fields.filter(field => field.isActive).sort((a, b) => a.order - b.order);
    } catch (error) {
      throw new Error('Failed to get active fields');
    }
  }

  static async getRequiredFields() {
    try {
      const summary = await this.getFrameSummary();
      return summary.fields.filter(field => field.required && field.isActive).sort((a, b) => a.order - b.order);
    } catch (error) {
      throw new Error('Failed to get required fields');
    }
  }

  static async getFieldsByType(type) {
    try {
      const summary = await this.getFrameSummary();
      return summary.fields.filter(field => field.type === type && field.isActive).sort((a, b) => a.order - b.order);
    } catch (error) {
      throw new Error('Failed to get fields by type');
    }
  }
}

export default FrameSummaryAPI;