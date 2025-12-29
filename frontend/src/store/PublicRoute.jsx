import { useLocation } from "react-router-dom";
import { useAuthStore } from "./AuthStore";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    const publicRoutes = [
      "/login",
      "/signup",
      "/verify-email",
      "/forgot-password",
      "/reset-password"
    ];

    const isPublic = publicRoutes.some(route =>
      location.pathname.startsWith(route)
    );

    if (!isPublic) {
      checkAuth();
    }
  }, [location.pathname]);

  return (
    <YourRoutes />
  );
}

export default App;
