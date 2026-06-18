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

				{/* USERS LIST (ALL ROLES) */}
				<Link to="/users">Users</Link>

				{/* ADMIN ONLY */}
				{user.role === "admin" && (
					<>
						<div className="mt-4 text-gray-400 text-sm">ADMIN</div>

						<Link to="/admin">Admin Dashboard</Link>

						<Link to="/admin/projects">All Projects</Link>

						<Link to="/admin/users">Admin Users</Link>

						<Link to="/admin/projects/create">Create Project</Link>

						<Link to="/admin/users/register">Create User</Link>
					</>
				)}
			</nav>
		</aside>
	);
};

export default Sidebar;
