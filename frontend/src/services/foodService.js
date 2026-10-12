import api from './api';

export const foodService = {
  async getAll(availableOnly = true) {
    const response = await api.get('/foods', {
      params: { availableOnly },
    });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/foods/${id}`);
    return response.data;
  },

  async getByRestaurant(restaurantId) {
    const response = await api.get(`/foods/restaurant/${restaurantId}`);
    return response.data;
  },

  async getByCategory(category) {
    const response = await api.get(`/foods/category/${category}`);
    return response.data;
  },

  async search(query) {
    const response = await api.get('/foods/search', {
      params: { query },
    });
    return response.data;
  },

  async create(data) {
    const response = await api.post('/foods', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/foods/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/foods/${id}`);
    return response.data;
  },

  async toggleAvailability(id) {
    const response = await api.patch(`/foods/${id}/availability`);
    return response.data;
  },
};

export default foodService;
