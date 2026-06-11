import { Link, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const AdminLayout = () => {
	const { user, logout } = useAuth();

	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();

		navigate("/login");
	};

	return (
		<>
			<header>
				<div className="container">
					<div className="flex flex-row justify-between">
						<div>
							<p>{user?.firstname}</p>
							<p>{user?.lastname}</p>
						</div>

						<nav className="flex gap-4">
							<Link to="/admin">Dashboard</Link>

							<Link to="/admin/projects">Projects</Link>

							<Link to="/admin/users">Users</Link>

							<button onClick={handleLogout}>Logout</button>
						</nav>
					</div>
				</div>
			</header>

			<main>
				<div className="container">
					<Outlet />
				</div>
			</main>
		</>
	);
};

export default AdminLayout;
