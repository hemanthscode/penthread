import { api } from '../utils';

export const fetchActivityLogs = () => api.get('/activity');
