import { useAuth } from 'react-oidc-context';

export const useApiDebug = () => {
  const auth = useAuth();

  const logAuthInfo = () => {
    console.log('=== Auth Debug Info ===');
    console.log('isAuthenticated:', auth.isAuthenticated);
    console.log('isLoading:', auth.isLoading);
    console.log('user:', auth.user);
    console.log('id_token:', auth.user?.id_token);
    console.log('access_token:', auth.user?.access_token);
    console.log('API Endpoint:', import.meta.env.VITE_API_ENDPOINT);
    console.log('=======================');
  };

  const testApiCall = async () => {
    if (!auth.user?.id_token) {
      console.error('No ID token available');
      return;
    }

    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
    if (!apiEndpoint) {
      console.error('VITE_API_ENDPOINT not configured');
      return;
    }

    try {
      const response = await fetch(`${apiEndpoint}/polls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth.user.id_token, // Using id_token as per your Lambda
        },
        body: JSON.stringify({
          question: "Best cloud provider?",
          options: ["AWS", "GCP", "Azure"]
        })
      });

      const data = await response.json();
      console.log('API Response:', { status: response.status, data });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${JSON.stringify(data)}`);
      }

      return data;
    } catch (error) {
      console.error('API Test Failed:', error);
      throw error;
    }
  };

  return { logAuthInfo, testApiCall };
};
