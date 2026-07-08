import PropTypes from 'prop-types';
import { createContext, useCallback, useMemo, useState } from 'react';

import { login, logout } from 'api/auth';
import { getStoredAuth } from 'api/authStorage';

export const AuthContext = createContext(null);

function redirectToLogin() {
  const baseName = import.meta.env.VITE_APP_BASE_NAME.replace(/\/$/, '');
  window.location.replace(`${baseName}/pages/login`);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredAuth());
  const isAuthenticated = Boolean(user?.token);

  const signOut = useCallback(() => {
    logout();
    setUser(null);
    redirectToLogin();
  }, []);

  const signIn = useCallback(async (credentials) => {
    const response = await login(credentials);
    setUser(response);
    return response;
  }, []);

  const value = useMemo(() => ({ user, isAuthenticated, signIn, signOut }), [user, isAuthenticated, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node };
