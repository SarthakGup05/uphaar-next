import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: '/api', // Base URL for all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error handling
    const customError = {
      message: error.response?.data?.error || 'An unexpected error occurred',
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);

export default api;
