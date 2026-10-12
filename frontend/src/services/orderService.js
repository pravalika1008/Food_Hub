import api from './api';

export const orderService = {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async getMyOrders() {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async getByOrderNumber(orderNumber) {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  async getByRestaurant(restaurantId) {
    const response = await api.get(`/orders/restaurant/${restaurantId}`);
    return response.data;
  },

  async getAllOrders() {
    const response = await api.get('/orders');
    return response.data;
  },

  async updateStatus(id, status, notes = '') {
    const response = await api.patch(`/orders/${id}/status`, { status, notes });
    return response.data;
  },

  async cancelOrder(id) {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  },
};

export default orderService;
