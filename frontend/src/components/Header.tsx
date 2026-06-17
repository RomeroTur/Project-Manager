import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
	const navigate = useNavigate();
	const { user, logout, loading } = useAuth();

	if (loading || !user) return null;

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	return (
		<header className="w-full flex justify-between items-center px-6 py-3 bg-white border-b">
			<h1 className="text-lg font-semibold">Welcome {user.firstname}</h1>

			<button
				onClick={handleLogout}
				className="px-3 py-1 border rounded hover:bg-gray-100"
			>
				Logout
			</button>
		</header>
	);
};

export default Header;
