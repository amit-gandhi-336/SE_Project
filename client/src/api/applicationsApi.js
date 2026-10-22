import api from './client';

export const applicationsApi = {
  submitApplication: async (appData) => {
    return api.post('/applications', appData);
  },

  listApplications: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.adopterId) params.append('adopterId', filters.adopterId);
    if (filters.petId) params.append('petId', filters.petId);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/applications${queryString}`);
  },

  trackApplication: async (id) => {
    return api.get(`/applications/${id}/track`);
  },

  reviewApplication: async (id) => {
    return api.get(`/applications/${id}`);
  },

  approveApplication: async (id, reviewData = {}) => {
    return api.post(`/applications/${id}/approve`, reviewData);
  },

  rejectApplication: async (id, reviewData = {}) => {
    return api.post(`/applications/${id}/reject`, reviewData);
  },

  updateApplication: async (id, updateData) => {
    return api.put(`/applications/${id}`, updateData);
  }
};

export default applicationsApi;
