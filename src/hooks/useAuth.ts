import { useAuth as useOidcAuth } from 'react-oidc-context';

export const useAuth = () => {
  const auth = useOidcAuth();
  
  const getUserName = () => {
    if (auth.user?.profile.name) return auth.user.profile.name;
    if (auth.user?.profile.email) {
      return auth.user.profile.email.split('@')[0];
    }
    return 'Anonymous';
  };

  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  const signOut = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    
    auth.removeUser();
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return {
    ...auth,
    getUserName,
    getUserInitial,
    signOut,
  };
};
