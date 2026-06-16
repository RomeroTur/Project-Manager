import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Project } from "../types/Project";

const ProjectsPage = () => {
	const [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		const load = async () => {
			const res = await fetch("http://localhost:3000/projects", {
				credentials: "include",
			});

			const data = await res.json();
			setProjects(data);
		};

		load();
	}, []);

	const getDeadline = (start?: string, end?: string) => {
		if (!end) return null;

		const startTime = start
			? new Date(start).getTime()
			: new Date().getTime();
		const endTime = new Date(end).getTime();

		return Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
	};

	return (
		<div>
			<h1>Projects</h1>

			<Link
				to="/admin/projects/create"
				className="px-3 py-1 border rounded"
			>
				Create Project
			</Link>

			{projects.map((p) => (
				<div key={p._id} className="border p-4 mb-4">
					<h2>{p.projectTitle}</h2>

					<p>{p.projectDescription}</p>

					<p>
						Start:{" "}
						{p.startDate
							? new Date(p.startDate).toLocaleDateString()
							: "Not set"}
					</p>

					<p>
						End:{" "}
						{p.endDate
							? new Date(p.endDate).toLocaleDateString()
							: "Not set"}
					</p>

					<p>
						Deadline:{" "}
						{getDeadline(p.startDate, p.endDate) ?? "Not set"} days
					</p>

					<div className="flex gap-3 mt-2">
						<Link to={`/admin/projects/${p._id}`}>View</Link>
						<Link to={`/admin/projects/${p._id}/edit`}>Edit</Link>
					</div>
				</div>
			))}
		</div>
	);
};

export default ProjectsPage;
