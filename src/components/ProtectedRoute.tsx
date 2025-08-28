import { useAuth } from "react-oidc-context"
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }: {children: React.ReactNode}) => {
    const {isLoading, isAuthenticated} = useAuth()
     if (isLoading === false) {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  }
};
export default ProtectedRoute