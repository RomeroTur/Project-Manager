import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditProjectPage = () => {
	const { id } = useParams();

	const navigate = useNavigate();

	const [title, setTitle] = useState("");

	const [description, setDescription] = useState("");

	useEffect(() => {
		const loadProject = async () => {
			const response = await fetch(
				`http://localhost:3000/projects/${id}`,
			);

			const data = await response.json();

			setTitle(data.title);
			setDescription(data.description);
		};

		loadProject();
	}, [id]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await fetch(`http://localhost:3000/projects/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title,
				description,
			}),
		});

		navigate("/admin/projects");
	};

	return (
		<form onSubmit={handleSubmit}>
			<h1>Edit Project</h1>

			<input value={title} onChange={(e) => setTitle(e.target.value)} />

			<textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>

			<button type="submit">Save</button>
		</form>
	);
};

export default EditProjectPage;
