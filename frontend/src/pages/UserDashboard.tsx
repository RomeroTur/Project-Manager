import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { DashboardProject } from "../types/DashboardProject";
import type { DashboardUser } from "../types/DashboardUser";

const UserDashboard = () => {
	const [projects, setProjects] = useState<DashboardProject[]>([]);
	const [users, setUsers] = useState<DashboardUser[]>([]);

	const [loadingProjects, setLoadingProjects] = useState(true);
	const [loadingUsers, setLoadingUsers] = useState(true);

	useEffect(() => {
		const loadProjects = async () => {
			try {
				const res = await fetch(
					"http://localhost:3000/projects/my-projects",
					{
						credentials: "include",
					},
				);

				const data = await res.json();
				setProjects(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoadingProjects(false);
			}
		};

		const loadUsers = async () => {
			try {
				const res = await fetch("http://localhost:3000/users", {
					credentials: "include",
				});

				const data = await res.json();
				setUsers(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoadingUsers(false);
			}
		};

		loadProjects();
		loadUsers();
	}, []);

	const calculateDaysLeft = (start?: string, end?: string) => {
		if (!start || !end) return null;

		const startTime = new Date(start).getTime();
		const endTime = new Date(end).getTime();

		return Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
	};

	return (
		<div className="grid grid-cols-2 gap-8">
			{/* ================= LEFT: PROJECTS ================= */}
			<div>
				<h2 className="text-2xl font-bold mb-4">My Projects</h2>

				{loadingProjects && <p>Loading projects...</p>}

				{projects.map((project) => {
					const sortedTasks = [...project.tasks].sort(
						(a: any, b: any) => {
							// user task first
							const mineA =
								typeof a.taskMember === "string"
									? false
									: false;

							const mineB =
								typeof b.taskMember === "string"
									? false
									: false;

							return Number(mineB) - Number(mineA);
						},
					);

					return (
						<div
							key={project._id}
							className="border rounded p-4 mb-4"
						>
							<h3 className="font-bold text-lg">
								{project.projectTitle}
							</h3>

							<p>Status: {project.projectStatus}</p>

							<p>
								Start:{" "}
								{project.startDate
									? new Date(
											project.startDate,
										).toLocaleDateString()
									: "-"}
							</p>

							<p>
								End:{" "}
								{project.endDate
									? new Date(
											project.endDate,
										).toLocaleDateString()
									: "-"}
							</p>

							{calculateDaysLeft(
								project.startDate,
								project.endDate,
							) !== null && (
								<p>
									Deadline:{" "}
									{calculateDaysLeft(
										project.startDate,
										project.endDate,
									)}{" "}
									days
								</p>
							)}

							{/* TASKS */}
							<div className="mt-3">
								<h4 className="font-semibold">Tasks</h4>

								{sortedTasks.map((task: any) => (
									<div
										key={task._id}
										className="border p-2 mt-2"
									>
										<p>
											<strong>{task.taskTitle}</strong>
										</p>

										<p>Status: {task.taskStatus}</p>

										<p>
											Member:{" "}
											{!task.taskMember
												? "Unassigned"
												: typeof task.taskMember ===
													  "string"
													? task.taskMember
													: `${task.taskMember.firstname} ${task.taskMember.lastname}`}
										</p>
									</div>
								))}
							</div>

							<div className="flex gap-3 mt-3">
								<Link to={`/projects/${project._id}`}>
									View
								</Link>
							</div>
						</div>
					);
				})}
			</div>

			{/* ================= RIGHT: USERS ================= */}
			<div>
				<h2 className="text-2xl font-bold mb-4">Users</h2>

				{loadingUsers && <p>Loading users...</p>}

				{users.map((user) => (
					<div key={user._id} className="border rounded p-4 mb-4">
						<h3 className="font-bold text-lg">
							{user.firstname} {user.lastname}
						</h3>

						<p>Available: {user.available ? "Yes" : "No"}</p>

						<p>
							Skills:{" "}
							{user.skills.length ? user.skills.join(", ") : "-"}
						</p>

						<div className="mt-3">
							<Link to={`/users/${user._id}`}>View</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default UserDashboard;
