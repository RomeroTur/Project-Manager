import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
type Role = "admin" | "user";

interface ProtectedRouteProps {
	/** If provided, only users with this role can access the route */
	role?: Role;
}

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
	const { user } = useAuth();

	/*if (loading) {
		return (
			<div className="flex h-screen items-center justify-center bg-gray-950">
				<span className="text-sm text-gray-400 animate-pulse">
					Loading…
				</span>
			</div>
		);
	}*/

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (role && user.role !== role) {
		// Wrong role — send each to their own dashboard
		return (
			<Navigate
				to={user.role === "admin" ? "/admin" : "/dashboard"}
				replace
			/>
		);
	}

	return <Outlet />;
}
