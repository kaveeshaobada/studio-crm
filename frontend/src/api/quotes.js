import api from './axios';

export const fetchQuotes = (projectId) =>
    api.get(projectId ? `/quotes?projectId=${projectId}` : '/quotes').then((res) => res.data);

export const fetchQuoteById = (id) =>
    api.get(`/quotes/${id}`).then((res) => res.data);

export const createQuote = (quoteData) =>
    api.post('/quotes', quoteData).then((res) => res.data);

export const updateQuoteStatus = (id, status) =>
    api.patch(`/quotes/${id}/status`, { status }).then((res) => res.data);
