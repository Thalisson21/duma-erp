import { API_URL } from 'config';
import { clearStoredAuth, getStoredToken } from './authStorage';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function buildUrl(path) {
  return `${API_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function handleUnauthorized() {
  clearStoredAuth();
  const baseName = import.meta.env.VITE_APP_BASE_NAME.replace(/\/$/, '');
  window.location.replace(`${baseName}/pages/login`);
}

export async function request(path, options = {}) {
  const { skipUnauthorizedHandler = false, ...fetchOptions } = options;
  const token = getStoredToken();

  const response = await fetch(buildUrl(path), {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...fetchOptions.headers
    }
  });

  const contentType = response.headers.get('content-type');
  const data = contentType?.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    if ((response.status === 401 || response.status === 403) && !skipUnauthorizedHandler) handleUnauthorized();

    throw new ApiError(data?.message || 'Não foi possível completar a solicitação.', response.status, data);
  }

  return data;
}
