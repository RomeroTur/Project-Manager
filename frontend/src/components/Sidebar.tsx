import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
	const { user, loading } = useAuth();

	if (loading || !user) return null;

	return (
		<aside className="w-64 min-h-screen bg-gray-900 text-white p-4">
			<h2 className="text-xl font-bold mb-6">Project Manager</h2>

			<nav className="flex flex-col gap-3">
				{/* COMMON */}
				<Link to="/dashboard">Dashboard</Link>
				<Link to="/projects">Projects</Link>

				{/* USER */}
				{user.role === "user" && (
					<>
						<Link to={`/users/${user._id}`}>My Profile</Link>
					</>
				)}

				{/* ADMIN */}
				{user.role === "admin" && (
					<>
						<Link to="/admin">Admin Dashboard</Link>
						<Link to="/admin/projects">Admin Projects</Link>
						<Link to="/admin/users">Users</Link>
					</>
				)}
			</nav>
		</aside>
	);
};

export default Sidebar;
