import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
	const { user, loading } = useAuth();

	if (loading || !user) {
		return null;
	}

	const dashboardLink = user.role === "admin" ? "/admin" : "/dashboard";

	const projectsLink =
		user.role === "admin" ? "/admin/projects" : "/projects";

	const usersLink =
		user.role === "admin" ? "/admin/users" : `/users/${user._id}`;

	return (
		<aside className="w-64 min-h-screen bg-gray-900 text-white p-4">
			<h2 className="text-xl font-bold mb-6">Project Manager</h2>

			<nav className="flex flex-col gap-3">
				<Link to={dashboardLink}>Dashboard</Link>

				<Link to={projectsLink}>Projects</Link>

				<Link to={usersLink}>Users</Link>
			</nav>
		</aside>
	);
};

export default Sidebar;
