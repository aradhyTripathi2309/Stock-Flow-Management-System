// utils/api.js
import axios from 'axios';
import Swal from 'sweetalert2';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5175',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pos-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('pos-token');
          window.location.href = '/login';
          break;
        
        case 403:
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You do not have permission to perform this action.',
            background: '#0f172a',
            color: '#fff',
          });
          break;
        
        case 404:
          Swal.fire({
            icon: 'error',
            title: 'Not Found',
            text: 'The requested resource was not found.',
            background: '#0f172a',
            color: '#fff',
          });
          break;
        
        case 500:
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Something went wrong on our end. Please try again later.',
            background: '#0f172a',
            color: '#fff',
          });
          break;
        
        default:
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data?.message || 'An unexpected error occurred.',
            background: '#0f172a',
            color: '#fff',
          });
      }
    } else if (error.request) {
      // Network error
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Unable to connect to the server. Please check your internet connection.',
        background: '#0f172a',
        color: '#fff',
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
