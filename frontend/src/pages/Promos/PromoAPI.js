import axiosInstance from "../../../api/axios";

const API_BASE_URL = `/api/promos`;

class PromoAPI {
  static async getPromos() {
    const response = await axiosInstance.get(API_BASE_URL);
    return response.data;
  }

  static async createPromo(promo) {
    const response = await axiosInstance.post(API_BASE_URL, promo, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  }

  static async updatePromo(id, promo) {
    const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, promo, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  }

  static async deletePromo(id) {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  }

  static async validatePromo(code) {
    const response = await axiosInstance.post(`${API_BASE_URL}/validate`, { code }, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log({res: response})
    return response.data;
  }
}

export default PromoAPI;
