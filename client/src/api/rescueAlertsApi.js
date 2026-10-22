import api from './client';

export const rescueAlertsApi = {
  createRescueAlert: async (alertData) => {
    return api.post('/rescue-alerts', alertData);
  },

  listAlerts: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.severity && filters.severity !== 'All') params.append('severity', filters.severity);
    if (filters.volunteerId) params.append('volunteerId', filters.volunteerId);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/rescue-alerts${queryString}`);
  },

  getAlertDetails: async (id) => {
    return api.get(`/rescue-alerts/${id}`);
  },

  assignVolunteer: async (id, volunteerId) => {
    return api.post(`/rescue-alerts/${id}/assign`, { volunteerId });
  },

  updateRescueAlert: async (id, updateData) => {
    return api.put(`/rescue-alerts/${id}`, updateData);
  },

  completeRescue: async (id) => {
    return api.post(`/rescue-alerts/${id}/complete`);
  },

  closeAlert: async (id) => {
    return api.post(`/rescue-alerts/${id}/close`);
  }
};

export default rescueAlertsApi;
