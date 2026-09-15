import api from './axios';

export const fetchPortalData = (portalToken) =>
    api.get(`/public/portal/${portalToken}`).then((res) => res.data);

export const respondToQuote = (portalToken, quoteId, action) =>
    api.post(`/public/portal/${portalToken}/quotes/${quoteId}/respond`, { action }).then((res) => res.data);
