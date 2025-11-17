import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const BASIC_AUTH_LOGIN = import.meta.env.VITE_BASIC_AUTH_LOGIN;
const BASIC_AUTH_PASSWORD = import.meta.env.VITE_BASIC_AUTH_PASSWORD;
const SHOULD_USE_BASIC_AUTH = import.meta.env.DEV;

const getBasicAuthHeader = () => {
  if (!BASIC_AUTH_LOGIN || !BASIC_AUTH_PASSWORD) return null;

  const encodedCredentials = btoa(`${BASIC_AUTH_LOGIN}:${BASIC_AUTH_PASSWORD}`);

  return `Basic ${encodedCredentials}`;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Adding authorization header based on environment
axiosInstance.interceptors.request.use(async (config) => {
  const headers = { ...(config.headers || {}) } as Record<string, string>;

  if (SHOULD_USE_BASIC_AUTH) {
    const basicAuthHeader = getBasicAuthHeader();

    if (basicAuthHeader) {
      headers.Authorization = basicAuthHeader;
    }
  } else {
    const authToken = localStorage.getItem('auth_token');

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    } else {
      delete headers.Authorization;
    }
  }

  return {
    ...config,
    headers,
  };
});

axiosInstance.interceptors.response.use(
  (response) => (response.data.data ? response.data.data : response.data),
  (error) => {
    return Promise.reject({
      status: error.response?.status,
      data: error.response?.data || error.message,
    });
  },
);

export default axiosInstance;
