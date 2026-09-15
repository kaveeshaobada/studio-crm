import api from './axios';

export const fetchClients = () => api.get('/clients').then((res) => res.data);

export const createClient = (clientData) => api.post('/clients', clientData).then((res) => res.data);
