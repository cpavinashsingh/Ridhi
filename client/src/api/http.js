import axios from 'axios';

const getApiBaseUrl = () => {
  // Prefer explicit env var when provided.
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // On deployed frontends (Netlify/Vercel), use same-origin /api proxy.
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return '/api';
    }
  }

  // Development fallback.
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
