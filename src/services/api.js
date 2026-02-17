import axios from 'axios';
import { TOKEN_KEYS } from '../utils/constants';

const API_URL = process.env.REACT_APP_API_URL;
const TIMEOUT = parseInt(process.env.REACT_APP_TIMEOUT, 10) || 10000;

export const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;