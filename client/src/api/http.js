import axios from 'axios';

const getApiBaseUrl = () => {
  // Production: use environment variable pointing to Railway backend
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Development: use localhost
  return 'http://localhost:5000/api';
};

const http = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

http.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('chat-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default http;
