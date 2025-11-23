import axiosInstance from "../../../api/axios";


class FrameSummaryAPI {
  // Get or create the single frame summary
  static async getFrameSummary() {
    const response = await axiosInstance.get("/api/frame-summary");

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Failed to get frame summary');
    }

    const summaries = response.data;

    if (summaries.length > 0) {
      console.log("yes summary")
      return summaries[0]; // Return the first (and only) summary
    } else {
      // Create a new one if none exists
      console.log("no summary")
      return await this.createFrameSummary({});
    }
  }

  static async createFrameSummary(data) {
    const response = await axiosInstance.post("/api/frame-summary", data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Failed to create frame summary');
    }

    return response.data;
  }


  static async updateFrameSummary(id, data) {
    const response = await axiosInstance.put(`/api/frame-summary/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Failed to update frame summary');
    }

    return response.data;
  }

  // Field-specific operations
  static async addField(summaryId, fieldData) {
    const response = await axiosInstance.post(`/api/frame-summary/${summaryId}/fields`, fieldData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Failed to create field');
    }

    return response.data;
  }

  static async updateField(summaryId, fieldIndex, fieldData) {
    const response = await axiosInstance.put(`/api/frame-summary/${summaryId}/fields/${fieldIndex}`, fieldData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Failed to update field');
    }

    return response.data;
  }

  static async removeField(summaryId, fieldIndex) {
    const response = await axiosInstance.delete(`/api/frame-summary/${summaryId}/fields/${fieldIndex}`);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Failed to delete field');
    }

    return response.data;
  }
}

export default FrameSummaryAPI;