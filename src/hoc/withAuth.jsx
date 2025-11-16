import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
      return <Spinner />;
    }

    if (!isAuthenticated) {
      return <Navigate to="/auth/login-1" />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
