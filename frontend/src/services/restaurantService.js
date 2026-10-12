import api from './api';

export const restaurantService = {
  async getAll(activeOnly = true) {
    const response = await api.get('/restaurants', {
      params: { activeOnly },
    });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },

  async getByCuisine(cuisine) {
    const response = await api.get(`/restaurants/cuisine/${cuisine}`);
    return response.data;
  },

  async search(query) {
    const response = await api.get('/restaurants/search', {
      params: { query },
    });
    return response.data;
  },

  async getByOwner(ownerId) {
    const response = await api.get(`/restaurants/owner/${ownerId}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/restaurants', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/restaurants/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  },

  async toggleStatus(id) {
    const response = await api.patch(`/restaurants/${id}/status`);
    return response.data;
  },
};

export default restaurantService;
