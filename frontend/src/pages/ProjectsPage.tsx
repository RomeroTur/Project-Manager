import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Project } from "../types/Project";

const ProjectsPage = () => {
	const [projects, setProjects] = useState<Project[]>([]);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadProjects = async () => {
			try {
				const response = await fetch("http://localhost:3000/projects", {
					credentials: "include",
				});

				const data = await response.json();

				setProjects(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		loadProjects();
	}, []);

	const handleDelete = async (id: string) => {
		const confirmed = window.confirm("Delete this project?");

		if (!confirmed) return;

		try {
			await fetch(`http://localhost:3000/projects/${id}`, {
				method: "DELETE",
				credentials: "include",
			});

			setProjects((prev) => prev.filter((project) => project._id !== id));
		} catch (err) {
			console.error(err);
		}
	};

	if (loading) {
		return <p>Loading projects...</p>;
	}

	return (
		<div>
			<div className="flex justify-between mb-4">
				<h1>Projects</h1>

				<Link to="/admin/projects/create">Create Project</Link>
			</div>

			{projects.length === 0 && <p>No projects available.</p>}

			{projects.map((project) => (
				<div key={project._id} className="border p-4 mb-4">
					<h2>{project.title}</h2>

					<p>{project.description}</p>

					<div className="flex gap-2 mt-2">
						<Link to={`/admin/projects/${project._id}`}>View</Link>

						<Link to={`/admin/projects/${project._id}/edit`}>
							Edit
						</Link>

						<button onClick={() => handleDelete(project._id)}>
							Delete
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default ProjectsPage;
