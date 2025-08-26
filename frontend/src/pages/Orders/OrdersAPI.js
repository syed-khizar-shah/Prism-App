const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/orders`;

class OrdersAPI {
  static async getOrders({ page = 1, limit = 20, status, search } = {}) {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('limit', limit);
    if (status) params.set('status', status);
    if (search) params.set('search', search);

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  }

  static async getOrderById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  }

  static async getOrderByOrderId(orderId) {
    const response = await fetch(`${API_BASE_URL}/by-order-id/${orderId}`);
    if (!response.ok) throw new Error('Failed to fetch order by orderId');
    return response.json();
  }

  static async updateOrder(id, data) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
  }

  static async updateStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update status');
    return response.json();
  }

  static async deleteOrder(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete order');
    return response.json();
  }

  static async downloadReceipt(id) {
    const response = await fetch(`${API_BASE_URL}/${id}/receipt`);
    if (!response.ok) throw new Error('Failed to generate receipt');
    const blob = await response.blob();
    return blob;
  }
}

export default OrdersAPI;
