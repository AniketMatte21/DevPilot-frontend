import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

const ProtectedRoute = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me"),
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;