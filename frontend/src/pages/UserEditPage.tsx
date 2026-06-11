import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserEditPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [role, setRole] = useState("user");

	useEffect(() => {
		const load = async () => {
			const res = await fetch(`http://localhost:3000/users/${id}`, {
				credentials: "include",
			});

			const data = await res.json();

			setFirstname(data.firstname);
			setLastname(data.lastname);
			setRole(data.role);
		};

		load();
	}, [id]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await fetch(`http://localhost:3000/users/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				firstname,
				lastname,
				role,
			}),
			credentials: "include",
		});

		navigate("/admin/users");
	};

	return (
		<form onSubmit={handleSubmit}>
			<h1>Edit User</h1>

			<input
				value={firstname}
				onChange={(e) => setFirstname(e.target.value)}
			/>

			<input
				value={lastname}
				onChange={(e) => setLastname(e.target.value)}
			/>

			<select value={role} onChange={(e) => setRole(e.target.value)}>
				<option value="user">User</option>
				<option value="admin">Admin</option>
			</select>

			<button type="submit">Save</button>
		</form>
	);
};

export default UserEditPage;
