import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function RootRedirect() {
	const { user, loading } = useAuth();

	if (loading) return null;
	if (!user) return <Navigate to="/login" replace />;

	return (
		<Navigate
			to={user.role === "admin" ? "/admin" : "/dashboard"}
			replace
		/>
	);
}
