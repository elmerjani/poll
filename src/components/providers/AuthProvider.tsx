import type { ReactNode } from "react";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: import.meta.env.VITE_COGNITO_RESPONSE_TYPE,
  post_logout_redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  scope: import.meta.env.VITE_COGNITO_SCOPE,
};

export default function Component({ children }: { children: ReactNode }) {
  console.log(cognitoAuthConfig);
  return (
    <AuthProvider
      {...cognitoAuthConfig}
      onSigninCallback={() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }}
    >
      {children}
    </AuthProvider>
  );
}
