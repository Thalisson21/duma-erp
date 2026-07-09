/**
 * axios setup to use API services
 */
import axios from 'axios';

import { clearStoredAuth, getStoredToken } from 'api/authStorage';

const axiosServices = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3010/'
});

function redirectToLogin() {
  const baseName = import.meta.env.VITE_APP_BASE_NAME?.replace(/\/$/, '') || '';
  window.location.replace(`${baseName}/pages/login`);
}

// ==============================|| AXIOS - FOR API SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('serviceToken') || getStoredToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const skipUnauthorizedHandler = error.config?.skipUnauthorizedHandler;

    if ((status === 401 || status === 403) && !skipUnauthorizedHandler && !window.location.href.includes('/pages/login')) {
      clearStoredAuth();
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default axiosServices;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.get(url, { ...config });

  return res.data;
};
