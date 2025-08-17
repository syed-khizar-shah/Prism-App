// services/promosAPI.js
const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/promos`;

class PromoAPI {
  static async getPromos() {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch promos');
    return response.json();
  }

  static async createPromo(promo) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promo)
    });
    if (!response.ok) throw new Error('Failed to create promo');
    return response.json();
  }

  static async updatePromo(id, promo) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promo)
    });
    if (!response.ok) throw new Error('Failed to update promo');
    return response.json();
  }

  static async deletePromo(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete promo');
    return response.json();
  }

  static async validatePromo(code) {
    const response = await fetch(`${API_BASE_URL}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    if (!response.ok) throw new Error('Failed to validate promo');
    return response.json();
  }
}

export default PromoAPI;
