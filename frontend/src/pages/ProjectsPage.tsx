import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const ProjectsPage = () => {
	const { user } = useAuth();
	const [projects, setProjects] = useState<any[]>([]);

	useEffect(() => {
		const load = async () => {
			const url =
				user?.role === "admin"
					? "http://localhost:3000/projects"
					: "http://localhost:3000/projects/my-projects";

			const res = await fetch(url, {
				credentials: "include",
			});

			const data = await res.json();
			setProjects(data);
		};

		if (user) load();
	}, [user]);

	return (
		<div>
			<h1>Projects</h1>

			{projects.map((project) => (
				<div key={project._id} className="border p-3 mb-3">
					<h3>{project.projectTitle}</h3>
					<p>Status: {project.projectStatus}</p>

					{/* ADMIN */}
					{user?.role === "admin" ? (
						<>
							<Link to={`/admin/projects/${project._id}`}>
								View
							</Link>
							<Link to={`/admin/projects/${project._id}/edit`}>
								Edit
							</Link>
						</>
					) : (
						<>
							<Link to={`/projects/${project._id}`}>View</Link>
						</>
					)}
				</div>
			))}
		</div>
	);
};

export default ProjectsPage;
