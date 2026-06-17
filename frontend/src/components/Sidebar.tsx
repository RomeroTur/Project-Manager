import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { User } from "../types/User";

const Sidebar = () => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const loadUser = async () => {
			try {
				const res = await fetch("http://localhost:3000/users/me", {
					credentials: "include",
				});

				const data = await res.json();
				setUser(data);
			} catch (err) {
				console.error(err);
			}
		};

		loadUser();
	}, []);

	return (
		<aside className="w-64 min-h-screen bg-gray-900 text-white p-4">
			<h2 className="text-xl font-bold mb-6">Project Manager</h2>

			<nav className="flex flex-col gap-3">
				<Link to="/" className="hover:text-gray-300">
					Dashboard
				</Link>

				{/* USER VIEW */}
				{user?.role === "user" && (
					<>
						<Link to="/dashboard" className="hover:text-gray-300">
							My Dashboard
						</Link>

						<Link to="/projects" className="hover:text-gray-300">
							My Projects
						</Link>

						<Link to="/users" className="hover:text-gray-300">
							Users
						</Link>
					</>
				)}

				{/* ADMIN VIEW */}
				{user?.role === "admin" && (
					<>
						<Link to="/admin" className="hover:text-gray-300">
							Admin Dashboard
						</Link>

						<Link
							to="/admin/projects"
							className="hover:text-gray-300"
						>
							Projects
						</Link>

						<Link to="/admin/users" className="hover:text-gray-300">
							Users
						</Link>
					</>
				)}
			</nav>
		</aside>
	);
};

export default Sidebar;
