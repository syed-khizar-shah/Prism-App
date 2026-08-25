import axios from "axios";
import axiosInstance from "../../../api/axios";

class OrdersAPI {

  static async getOrders({ page = 1, limit = 20, status, search } = {}) {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('limit', limit);
    if (status) params.set('status', status);
    if (search) params.set('search', search);

    const response = await axiosInstance.get(`/api/orders?${params.toString()}`);
    const data = response.data
    if (!data.success) throw new Error('Failed to fetch orders');
    return data;
  }

  static async getOrderById(id) {
    const response = await axiosInstance.get(`/api/orders/${id}`);
    const data = response.data
    if (!data.success) throw new Error('Failed to fetch order');
    return data
  }

  static async getOrderByOrderId(orderId) {
    const response = await axiosInstance.get(`/api/orders/by-order-id/${orderId}`);
    const data = response.data
    if (!data.success) throw new Error('Failed to fetch order');
    return data;
  }

  static async updateOrder(id, data) {
    const response = await axiosInstance.put(`/api/orders/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  }


  static async updateStatus(id, status) {
    const response = await axiosInstance.patch(`/api/orders/${id}/status`, { status }, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  }


  static async deleteOrder(id) {
    const response = await axiosInstance.delete(`/api/orders/${id}`);
    return response.data;
  }


  static async downloadReceipt(id) {
    const response = await axiosInstance.get(`/api/orders/${id}/receipt`, {
      responseType: 'blob' // important to get the file as a blob
    });
    return response.data; // Axios returns the blob directly in response.data
  }

  static async addPayment(id, transaction) {
    const response = await axiosInstance.post(`/api/orders/${id}/payments`, transaction);
    const data = response.data;
    if (!data.success) throw new Error(data.error || 'Failed to add payment');
    return data;
  }


}

export default OrdersAPI;
