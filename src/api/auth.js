import { ApiError, request } from './httpClient';
import { clearStoredAuth, setStoredAuth } from './authStorage';

export async function login(credentials) {
  try {
    const response = await request('login', {
      method: 'POST',
      data: credentials,
      skipUnauthorizedHandler: true
    });

    setStoredAuth(response);
    return response;
  } catch (error) {
    const invalidCredentials = error.status === 404 || error.data?.message?.toLowerCase() === 'invalid credentials';

    if (invalidCredentials) {
      throw new ApiError('As credenciais estão inválidas.', error.status, error.data);
    }

    throw error;
  }
}

export function logout() {
  clearStoredAuth();
}
