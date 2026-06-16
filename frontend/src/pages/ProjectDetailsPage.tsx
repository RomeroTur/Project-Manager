import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import type { Project } from "../types/Project";

const ProjectDetailsPage = () => {
	const { id } = useParams();

	const [project, setProject] = useState<Project | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try {
				const res = await fetch(
					`http://localhost:3000/projects/${id}`,
					{ credentials: "include" },
				);

				const data = await res.json();
				setProject(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		load();
	}, [id]);

	if (loading) return <p>Loading...</p>;
	if (!project) return <p>Project not found</p>;

	const startTime = project.startDate
		? new Date(project.startDate).getTime()
		: new Date().getTime();

	const endTime = project.endDate
		? new Date(project.endDate).getTime()
		: null;

	const deadlineDays =
		endTime !== null
			? Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24))
			: null;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">{project.projectTitle}</h1>
				<p>{project.projectDescription}</p>
			</div>

			<div className="border p-4">
				<p>
					<strong>Status:</strong> {project.projectStatus}
				</p>

				<p>
					<strong>Start:</strong>{" "}
					{project.startDate
						? new Date(project.startDate).toLocaleDateString()
						: "Not set"}
				</p>

				<p>
					<strong>End:</strong>{" "}
					{project.endDate
						? new Date(project.endDate).toLocaleDateString()
						: "Not set"}
				</p>

				<p>
					<strong>Deadline:</strong>{" "}
					{deadlineDays !== null ? `${deadlineDays} days` : "Not set"}
				</p>

				<p>
					<strong>Members:</strong>{" "}
					{project.projectMembers?.length
						? project.projectMembers
								.map((m) =>
									typeof m === "string"
										? m
										: `${m.firstname} ${m.lastname}`,
								)
								.join(", ")
						: "Not assigned yet"}
				</p>
			</div>

			<div>
				<h2 className="font-semibold">Tasks</h2>

				{project.tasks.length === 0 && <p>No tasks</p>}

				{project.tasks.map((task) => (
					<div key={task._id} className="border p-3 mt-2">
						<p>
							<strong>{task.taskTitle}</strong>
						</p>

						<p>Status: {task.taskStatus}</p>

						<p>
							Member:{" "}
							{!task.taskMember
								? "Unassigned"
								: typeof task.taskMember === "string"
									? task.taskMember
									: `${task.taskMember.firstname} ${task.taskMember.lastname}`}
						</p>
					</div>
				))}
			</div>

			<div className="flex gap-3">
				<Link to={`/admin/projects/${project._id}/edit`}>Edit</Link>
				<Link to="/admin/projects">Back</Link>
			</div>
		</div>
	);
};

export default ProjectDetailsPage;
