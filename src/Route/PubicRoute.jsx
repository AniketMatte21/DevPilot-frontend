import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

const PublicRoute = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me"),
    retry: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Already logged in
  if (!isError && data) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;