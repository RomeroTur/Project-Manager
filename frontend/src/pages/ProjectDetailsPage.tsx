import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Project } from "../types/Project";

const ProjectDetailsPage = () => {
	const { id } = useParams();

	const [project, setProject] = useState<Project | null>(null);

	useEffect(() => {
		const loadProject = async () => {
			const response = await fetch(
				`http://localhost:3000/projects/${id}`,
				{
					credentials: "include",
				},
			);

			const data = await response.json();

			setProject(data);
		};

		loadProject();
	}, [id]);

	if (!project) {
		return <p>Loading...</p>;
	}

	return (
		<div>
			<h1>{project.title}</h1>

			<p>{project.description}</p>

			<p>
				Start:
				{project.startdate}
			</p>

			<p>
				End:
				{project.enddate}
			</p>
		</div>
	);
};

export default ProjectDetailsPage;
