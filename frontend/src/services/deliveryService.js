import api from './api';

export const deliveryService = {
  async getAll() {
    const response = await api.get('/deliveries');
    return response.data;
  },

  async getByOrderId(orderId) {
    const response = await api.get(`/deliveries/order/${orderId}`);
    return response.data;
  },

  async getMyDeliveries() {
    const response = await api.get('/deliveries/my-deliveries');
    return response.data;
  },

  async getPending() {
    const response = await api.get('/deliveries/pending');
    return response.data;
  },

  async assignDelivery(orderId, deliveryPersonId) {
    const response = await api.post(`/deliveries/order/${orderId}/assign`, null, {
      params: { deliveryPersonId },
    });
    return response.data;
  },

  async updateStatus(deliveryId, status, notes = '') {
    const response = await api.patch(`/deliveries/${deliveryId}/status`, { status, notes });
    return response.data;
  },
};

export default deliveryService;
