import api from './client';

export const petsApi = {
  listPets: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.species && filters.species !== 'All') params.append('species', filters.species);
    if (filters.adoptionStatus && filters.adoptionStatus !== 'All') params.append('adoptionStatus', filters.adoptionStatus);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/pets${queryString}`);
  },

  getPetById: async (id) => {
    return api.get(`/pets/${id}`);
  },

  addPet: async (petData) => {
    return api.post('/pets', petData);
  },

  updatePetDetails: async (id, petData) => {
    return api.put(`/pets/${id}`, petData);
  },

  updateStatus: async (id, status) => {
    return api.patch(`/pets/${id}/status`, { status });
  },

  sponsorPet: async (id, sponsorData = {}) => {
    return api.post(`/pets/${id}/sponsor`, sponsorData);
  }
};

export default petsApi;
