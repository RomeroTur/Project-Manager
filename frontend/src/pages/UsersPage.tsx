import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "../types/User";

const UsersPage = () => {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const loadUsers = async () => {
			const res = await fetch("http://localhost:3000/users", {
				credentials: "include",
			});

			const data = await res.json();
			setUsers(data);
		};

		loadUsers();
	}, []);

	/*const handleDelete = async (id: string) => {
		await fetch(`http://localhost:3000/users/${id}`, {
			method: "DELETE",
			credentials: "include",
		});

		setUsers((prev) => prev.filter((u) => u._id !== id));
	};*/

	return (
		<div>
			<h1>Users</h1>

			<Link to="/admin/users/register">Register User</Link>

			{users.map((user) => (
				<div key={user._id}>
					<p>
						{user.firstname} {user.lastname}
					</p>
					<p>{user.email}</p>
					<p>{user.role}</p>

					<div>
						<Link to={`/admin/users/${user._id}`}>View</Link>

						<Link to={`/admin/users/${user._id}/edit`}>Edit</Link>

						{/*<button onClick={() => handleDelete(user._id)}>
							Delete
						</button>*/}
					</div>
				</div>
			))}
		</div>
	);
};

export default UsersPage;
