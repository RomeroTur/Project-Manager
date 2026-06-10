import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
	const { token } = useAuth();

	return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
