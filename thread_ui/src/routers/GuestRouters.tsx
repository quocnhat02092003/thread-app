import axios from "axios";
import React from "react";
import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  element: React.ReactElement;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(
    null
  );

  React.useEffect(() => {
    axios
      .get("http://localhost:5277/api/auth/check", { withCredentials: true }) // nhớ withCredentials để gửi cookie
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? <Navigate to="/" replace /> : element;
};

export default GuestRoute;
