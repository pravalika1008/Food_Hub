import api from './api';

export const paymentService = {
  async getByOrderId(orderId) {
    const response = await api.get(`/payments/order/${orderId}`);
    return response.data;
  },

  async processPayment(orderId, paymentMethod) {
    const response = await api.post(`/payments/order/${orderId}`, null, {
      params: { paymentMethod },
    });
    return response.data;
  },

  async updateStatus(paymentId, status) {
    const response = await api.patch(`/payments/${paymentId}/status`, { status });
    return response.data;
  },
};

export default paymentService;
