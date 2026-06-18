import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
	const { user, loading } = useAuth();

	if (loading || !user) return null;

	const dashboardLink = user.role === "admin" ? "/admin" : "/dashboard";
	const projectsLink =
		user.role === "admin" ? "/admin/projects" : "/projects";
	const usersLink =
		user.role === "admin" ? "/admin/users" : `/users/${user._id}`;

	return (
		<aside className="w-64 bg-gray-900 text-white p-5">
			<h2 className="text-xl font-bold mb-8">Project Manager</h2>

			<nav className="flex flex-col gap-2 text-sm">
				<Link
					className="hover:bg-gray-800 p-2 rounded"
					to={dashboardLink}
				>
					Dashboard
				</Link>

				<Link
					className="hover:bg-gray-800 p-2 rounded"
					to={projectsLink}
				>
					Projects
				</Link>

				<Link className="hover:bg-gray-800 p-2 rounded" to={usersLink}>
					Users
				</Link>
			</nav>
		</aside>
	);
};

export default Sidebar;
