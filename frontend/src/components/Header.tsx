import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
	const navigate = useNavigate();
	const { user, logout, loading } = useAuth();

	if (loading || !user) return null;

	return (
		<header className="bg-white border-b px-6 py-3 flex justify-between items-center">
			<h1 className="text-gray-700 font-medium">
				Welcome, <span className="font-semibold">{user.firstname}</span>
			</h1>

			<button
				onClick={async () => {
					await logout();
					navigate("/login");
				}}
				className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded text-sm"
			>
				Logout
			</button>
		</header>
	);
};

export default Header;
