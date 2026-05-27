import api from './axios';

export const getDashboardStats = () => api.get('/dashboard/stats');
export const getRevenueChart = () => api.get('/dashboard/revenue-chart');
export const getTopProducts = () => api.get('/dashboard/top-products');
