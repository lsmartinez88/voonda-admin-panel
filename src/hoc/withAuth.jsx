import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
      return <Spinner />;
    }

    if (!isAuthenticated) {
      return <Navigate to="/auth/login-1" />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
