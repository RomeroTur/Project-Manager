import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { User } from "../types/User";

const UserDetailsPage = () => {
	const { id } = useParams();

	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const load = async () => {
			const res = await fetch(`http://localhost:3000/users/${id}`, {
				credentials: "include",
			});

			const data = await res.json();
			setUser(data);
		};

		load();
	}, [id]);

	if (!user) return <p>Loading...</p>;

	return (
		<div>
			<h1>
				{user.firstname} {user.lastname}
			</h1>

			<p>{user.email}</p>
			<p>{user.role}</p>
		</div>
	);
};

export default UserDetailsPage;
