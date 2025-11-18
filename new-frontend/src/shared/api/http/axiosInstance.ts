import axios, { AxiosHeaders, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
const basicAuthLogin = import.meta.env.VITE_BASIC_AUTH_LOGIN;
const basicAuthPassword = import.meta.env.VITE_BASIC_AUTH_PASSWORD;
const shouldUseBasicAuth = import.meta.env.DEV;

const getBasicAuthHeader = () => {
  if (!basicAuthLogin || !basicAuthPassword) return null;

  const encodedCredentials = btoa(`${basicAuthLogin}:${basicAuthPassword}`);

  return `Basic ${encodedCredentials}`;
};

export const instance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const headers = AxiosHeaders.from(config.headers);

    if (shouldUseBasicAuth) {
      const basicAuthHeader = getBasicAuthHeader();

      if (basicAuthHeader) {
        headers.set('Authorization', basicAuthHeader);
      }
    } else {
      headers.delete('Authorization');
    }

    return { ...config, headers };
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject({
      status: error.response?.status,
      data: error.response?.data || error.message,
    }),
);

export default instance;
