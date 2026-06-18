import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import type { Project } from "../types/Project";

/* =========================
   DEADLINE CONFIG
========================= */

const DEADLINE_WARNING_DAYS = 14;
const DEADLINE_CRITICAL_DAYS = 7;

const getDeadlineStyle = (days: number | null) => {
	if (days === null) return {};

	if (days <= DEADLINE_CRITICAL_DAYS) {
		return {
			text: "text-red-600",
			card: "border-red-200 shadow-red-100",
		};
	}

	if (days <= DEADLINE_WARNING_DAYS) {
		return {
			text: "text-orange-500",
			card: "border-orange-200 shadow-orange-100",
		};
	}

	return {
		text: "text-gray-600",
		card: "",
	};
};

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
		<div className="space-y-6">
			{/* HEADER */}
			<div>
				<h1 className="text-2xl font-bold">Projects</h1>
				{/*<p className="text-sm text-gray-500">
					Overview of all assigned projects
				</p>*/}
			</div>

			{/* PROJECT LIST */}
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
				{projects.map((project) => {
					const deadline = calculateDays(
						project.startDate,
						project.endDate,
					);

					const deadlineStyle = getDeadlineStyle(deadline);

					return (
						<div
							key={project._id}
							className={`bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition flex flex-col h-full ${deadlineStyle.card}`}
						>
							{/* TITLE */}
							<h2 className="text-lg font-semibold">
								{project.projectTitle}
							</h2>

							{/* DESCRIPTION */}
							<p className="text-sm text-gray-600 mt-1">
								{project.projectDescription || "No description"}
							</p>

							{/* DATES */}
							<div className="text-sm text-gray-500 mt-3 space-y-1">
								<p>Start: {formatDate(project.startDate)}</p>
								<p>End: {formatDate(project.endDate)}</p>

								{/* DEADLINE */}
								{deadline !== null && (
									<p
										className={`font-semibold ${deadlineStyle.text}`}
									>
										Deadline: in {deadline} days
									</p>
								)}
							</div>

							{/* TASKS */}
							<div className="mt-4">
								<h3 className="text-sm font-semibold text-gray-700">
									Tasks
								</h3>

								{project.tasks?.length ? (
									<div className="mt-2 space-y-2">
										{project.tasks.map((task) => {
											const member = task.taskMember;

											const memberName = !member
												? "unassigned"
												: typeof member === "string"
													? member
													: `${member.firstname} ${member.lastname}`;

											return (
												<div
													key={task._id}
													className="border rounded p-2 text-sm bg-gray-50"
												>
													<p className="font-medium">
														{task.taskTitle}
													</p>

													<p className="text-gray-600">
														Status:{" "}
														{task.taskStatus}
													</p>

													<p className="text-gray-600">
														Assigned to:{" "}
														{memberName}
													</p>
												</div>
											);
										})}
									</div>
								) : (
									<p className="text-sm text-gray-400 mt-2">
										No tasks
									</p>
								)}
							</div>

							{/* ACTIONS */}
							<div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
								{user?.role === "admin" ? (
									<>
										<Link
											to={`/admin/projects/${project._id}`}
											className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
										>
											View →
										</Link>

										<Link
											to={`/admin/projects/${project._id}/edit`}
											className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
										>
											Edit
										</Link>
									</>
								) : (
									<Link
										className="text-sm text-blue-600 hover:underline"
										to={`/projects/${project._id}`}
									>
										View →
									</Link>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ProjectsPage;
