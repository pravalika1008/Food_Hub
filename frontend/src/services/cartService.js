import api from './api';

export const cartService = {
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  async addToCart(foodId, quantity = 1) {
    const response = await api.post('/cart/add', { foodId, quantity });
    return response.data;
  },

  async updateQuantity(itemId, quantity) {
    const response = await api.put(`/cart/items/${itemId}`, null, {
      params: { quantity },
    });
    return response.data;
  },

  async removeItem(itemId) {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};

export default cartService;
