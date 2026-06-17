import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Project, Task } from "../types/Project";
import type { User } from "../types/User";

/* -----------------------------
   ENRICHED TYPE (frontend only)
------------------------------*/
type UserWithTasks = User & {
	assignedTasks: {
		projectTitle: string;
		taskTitle: string;
		taskStatus: string;
	}[];
};

const UsersPage = () => {
	const [users, setUsers] = useState<UserWithTasks[]>([]);
	//const [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		const load = async () => {
			const [usersRes, projectsRes] = await Promise.all([
				fetch("http://localhost:3000/users", {
					credentials: "include",
				}),
				fetch("http://localhost:3000/projects", {
					credentials: "include",
				}),
			]);

			const usersData = await usersRes.json();
			const projectsData = await projectsRes.json();

			const enrichedUsers = usersData.map((user: User) => {
				const assignedTasks: {
					projectTitle: string;
					taskTitle: string;
					taskStatus: string;
				}[] = [];

				projectsData.forEach((project: Project) => {
					project.tasks.forEach((task: Task) => {
						const memberId =
							typeof task.taskMember === "string"
								? task.taskMember
								: task.taskMember?._id;

						if (memberId === user._id) {
							assignedTasks.push({
								projectTitle: project.projectTitle,
								taskTitle: task.taskTitle,
								taskStatus: task.taskStatus,
							});
						}
					});
				});

				return {
					...user,
					assignedTasks,
				};
			});

			setUsers(enrichedUsers);
		};

		load();
	}, []);

	return (
		<div>
			<h1>Users</h1>

			<Link to="/admin/users/register">Register User</Link>

			{users.map((user) => (
				<div key={user._id} className="border p-4 mt-4">
					<p>
						<strong>
							{user.firstname} {user.lastname}
						</strong>
					</p>

					<p>Role: {user.role}</p>

					<p>Available: {user.available ? "Yes" : "No"}</p>

					{/* ------------------ SKILLS ------------------ */}
					<p>
						Skills:{" "}
						{user.skills.length > 0
							? user.skills.join(", ")
							: "None"}
					</p>

					{/* ------------------ TASKS ------------------ */}
					<div className="mt-2">
						<p>
							<strong>Assigned Tasks:</strong>
						</p>

						{user.assignedTasks.length === 0 ? (
							<p>No tasks assigned</p>
						) : (
							user.assignedTasks.map((t, i) => (
								<div key={i} className="ml-4">
									<p>
										{t.projectTitle} → {t.taskTitle}
									</p>
									<p>Status: {t.taskStatus}</p>
								</div>
							))
						)}
					</div>

					{/* ------------------ ACTIONS ------------------ */}
					<div className="mt-3 flex gap-2">
						<Link to={`/admin/users/${user._id}`}>View User</Link>

						<Link to={`/admin/users/${user._id}/edit`}>
							Edit User
						</Link>
					</div>
				</div>
			))}
		</div>
	);
};

export default UsersPage;
