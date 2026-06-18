import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "../types/User";

const UserListPage = () => {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const load = async () => {
			const res = await fetch("http://localhost:3000/users", {
				credentials: "include",
			});

			const data = await res.json();
			setUsers(data);
		};

		load();
	}, []);

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Users</h1>

			{users.map((user) => (
				<div key={user._id} className="border p-3 mb-3">
					<p className="font-semibold">
						{user.firstname} {user.lastname}
					</p>

					<p>Role: {user.role}</p>

					<p>
						Skills:{" "}
						{user.skills?.length ? user.skills.join(", ") : "None"}
					</p>

					<div className="mt-2">
						<Link to={`/users/${user._id}`}>View</Link>
					</div>
				</div>
			))}
		</div>
	);
};

export default UserListPage;
