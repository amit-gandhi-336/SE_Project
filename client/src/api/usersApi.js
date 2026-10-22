import api from './client';

export const usersApi = {
  getAllUsers: async () => {
    return api.get('/users');
  },

  getVolunteers: async () => {
    return api.get('/users/volunteers');
  },

  getShelterWorkers: async () => {
    return api.get('/users/shelter-workers');
  },

  getAdopters: async () => {
    return api.get('/users/adopters');
  }
};

export default usersApi;
