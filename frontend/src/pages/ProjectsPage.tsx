import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import type { Project } from "../types/Project";

const ProjectsPage = () => {
	const { user } = useAuth();
	const [projects, setProjects] = useState<Project[]>([]);

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

	const calculateDays = (start?: string, end?: string) => {
		if (!start || !end) return null;

		const s = new Date(start).getTime();
		const e = new Date(end).getTime();

		return Math.ceil((e - s) / (1000 * 60 * 60 * 24));
	};

	const formatDate = (date?: string) => {
		if (!date) return "Not set";
		return new Date(date).toLocaleDateString();
	};

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Projects</h1>

			{projects.map((project) => {
				const deadline = calculateDays(
					project.startDate,
					project.endDate,
				);

				return (
					<div key={project._id} className="border p-4 mb-4 rounded">
						{/* TITLE */}
						<h2 className="text-lg font-bold">
							{project.projectTitle}
						</h2>

						{/* DESCRIPTION */}
						<p className="text-gray-700">
							{project.projectDescription || "No description"}
						</p>

						{/* DATES */}
						<p>Start: {formatDate(project.startDate)}</p>

						<p>End: {formatDate(project.endDate)}</p>

						{/* DEADLINE */}
						{deadline !== null && (
							<p className="font-semibold">
								Deadline: {deadline} days
							</p>
						)}

						{/* TASKS */}
						<div className="mt-3">
							<h3 className="font-semibold">Tasks</h3>

							{project.tasks?.length ? (
								project.tasks.map((task) => {
									const member = task.taskMember;

									const memberName = !member
										? "Unassigned"
										: typeof member === "string"
											? member
											: `${member.firstname} ${member.lastname}`;

									return (
										<div
											key={task._id}
											className="border p-2 mt-2"
										>
											<p>
												<strong>
													{task.taskTitle}
												</strong>
											</p>

											<p>Status: {task.taskStatus}</p>

											<p>Member: {memberName}</p>
										</div>
									);
								})
							) : (
								<p>No tasks</p>
							)}
						</div>

						{/* ACTIONS */}
						<div className="flex gap-3 mt-4">
							{user?.role === "admin" ? (
								<>
									<Link to={`/admin/projects/${project._id}`}>
										View
									</Link>

									<Link
										to={`/admin/projects/${project._id}/edit`}
									>
										Edit
									</Link>
								</>
							) : (
								<Link to={`/projects/${project._id}`}>
									View
								</Link>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default ProjectsPage;
