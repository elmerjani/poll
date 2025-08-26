import "./App.css";
import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();
  const signOutRedirect = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;
  
  return (
    <div>
      {auth.isAuthenticated ? (
        <>
          <h2>Welcome, {auth.user?.profile.email}</h2>
          <p>ID Token: {auth.user?.id_token}</p>
          <p>Access Token: {auth.user?.access_token}</p>
          <button onClick={() => {
            auth.removeUser();
            signOutRedirect();
          }}>Sign out</button>
        </>
      ) : (
        <button onClick={() => auth.signinRedirect()}>Sign in</button>
      )}
    </div>
  );
}

export default App;
