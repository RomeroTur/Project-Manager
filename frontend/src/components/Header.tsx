import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { User } from "../types/User";

const Header = () => {
	const navigate = useNavigate();
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

	const handleLogout = async () => {
		try {
			await fetch("http://localhost:3000/users/logout", {
				method: "POST",
				credentials: "include",
			});

			navigate("/login");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<header className="w-full flex justify-between items-center px-6 py-3 bg-white border-b">
			<h1 className="text-lg font-semibold">
				Welcome {user?.firstname ?? "User"}
			</h1>

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
