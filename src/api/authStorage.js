const AUTH_STORAGE_KEY = 'auth_user';
const SERVICE_TOKEN_KEY = 'serviceToken';

export function getStoredAuth() {
  try {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedAuth ? JSON.parse(storedAuth) : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function setStoredAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));

  if (auth?.token) {
    localStorage.setItem(SERVICE_TOKEN_KEY, auth.token);
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(SERVICE_TOKEN_KEY);
}

export function getStoredToken() {
  const auth = getStoredAuth();
  return auth?.token || localStorage.getItem(SERVICE_TOKEN_KEY) || null;
}
