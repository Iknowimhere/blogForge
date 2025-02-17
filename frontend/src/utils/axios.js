import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
// This runs before every request is sent
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response Interceptor
// This runs before the response reaches your .then() or .catch()
api.interceptors.response.use(
  (response) => {
    // Any status code between 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes outside range of 2xx cause this function to trigger
    if (error.response?.status === 401) {
      // If unauthorized, clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;