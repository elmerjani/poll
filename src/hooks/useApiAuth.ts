import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { setAuthToken } from '../api/baseApi';

export const useApiAuth = () => {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.id_token) {
      // Set the JWT ID token for API requests (not access_token)
      setAuthToken(auth.user.id_token);
    } else {
      // Clear token when not authenticated
      setAuthToken(null);
    }
  }, [auth.isAuthenticated, auth.user?.id_token]);

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    idToken: auth.user?.id_token,
    accessToken: auth.user?.access_token
  };
};
