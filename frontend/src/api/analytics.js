import api from './axios';

export const fetchAnalyticsStats = () =>
    api.get('/analytics/stats').then((res) => res.data);

export const fetchActivityLogs = () =>
    api.get('/analytics/activity').then((res) => res.data);
