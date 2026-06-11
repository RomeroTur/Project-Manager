import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const RootRedirect = () => {
	const { user, loading } = useAuth();

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return (
		<Navigate
			to={user.role === "admin" ? "/admin" : "/dashboard"}
			replace
		/>
	);
};

export default RootRedirect;
