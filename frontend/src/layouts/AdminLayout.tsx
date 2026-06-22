import { Outlet, useNavigate } from "react-router-dom";

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
			<header className="bg-gray-400">
				<div className="container">
					<div className="flex flex-row justify-between">
						<div>
							<p>{user?.firstname}</p>
							<p>{user?.lastname}</p>
						</div>
						<button onClick={handleLogout}>Logout</button>
					</div>
				</div>
			</header>

			<main className="flex">
				{/*<aside>
					<nav className="flex flex-col gap-4">
						<Link to="/admin">Dashboard</Link>

						<Link to="/admin/projects">Projects</Link>

						<Link to="/admin/users">Users</Link>
					</nav>
				</aside>*/}
				<div className="container">
					<Outlet />
				</div>
			</main>
		</>
	);
};

export default AdminLayout;
