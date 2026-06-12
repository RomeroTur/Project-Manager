import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { User } from "../types/User";

const EditProjectPage = () => {
	const { id } = useParams();

	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [members, setMembers] = useState<string[]>([]);
	const [startdate, setStartdate] = useState("");
	const [enddate, setEnddate] = useState("");
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const loadData = async () => {
			try {
				const [projectResponse, usersResponse] = await Promise.all([
					fetch(`http://localhost:3000/projects/${id}`, {
						credentials: "include",
					}),
					fetch("http://localhost:3000/users", {
						credentials: "include",
					}),
				]);

				const projectData = await projectResponse.json();
				const usersData = await usersResponse.json();

				setUsers(usersData);

				setTitle(projectData.title || "");
				setDescription(projectData.description || "");
				setMembers(projectData.members || []);

				setStartdate(
					projectData.startdate
						? new Date(projectData.startdate)
								.toISOString()
								.split("T")[0]
						: "",
				);

				setEnddate(
					projectData.enddate
						? new Date(projectData.enddate)
								.toISOString()
								.split("T")[0]
						: "",
				);
			} catch (err) {
				console.error(err);
			}
		};

		loadData();
	}, [id]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await fetch(`http://localhost:3000/projects/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				title,
				description,
				members,
				startdate,
				enddate,
			}),
		});

		navigate("/admin/projects");
	};

	return (
		<form onSubmit={handleSubmit}>
			<h1>Edit Project</h1>

			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>

			<textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>

			<input
				type="date"
				value={startdate}
				onChange={(e) => setStartdate(e.target.value)}
			/>

			<input
				type="date"
				value={enddate}
				onChange={(e) => setEnddate(e.target.value)}
			/>

			<select
				multiple
				value={members}
				onChange={(e) => {
					const selected = Array.from(
						e.target.selectedOptions,
						(option) => option.value,
					);

					setMembers(selected);
				}}
			>
				{users.map((user) => (
					<option key={user._id} value={user._id}>
						{user.firstname} {user.lastname}
					</option>
				))}
			</select>

			<button type="submit">Save</button>
		</form>
	);
};

export default EditProjectPage;
