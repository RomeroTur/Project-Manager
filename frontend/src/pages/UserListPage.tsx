import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Project, Task } from "../types/Project";
import type { User } from "../types/User";

type UserWithTasks = User & {
	assignedTasks: {
		projectTitle: string;
		taskTitle: string;
		taskStatus: string;
	}[];
};

const UserListPage = () => {
	const [users, setUsers] = useState<UserWithTasks[]>([]);

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
		<div className="space-y-6">
			{/* HEADER */}
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Users</h1>
			</div>

			{/* USER LIST (same layout as UsersPage) */}
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
				{users.map((user) => (
					<div
						key={user._id}
						className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition flex flex-col h-full"
					>
						{/* USER INFO */}
						<div>
							<h2 className="text-lg font-semibold">
								{user.firstname} {user.lastname}
							</h2>

							<p className="text-sm text-gray-500 mt-1">
								Role: {user.role}
							</p>

							<p className="text-sm text-gray-500">
								Available: {user.available ? "Yes" : "No"}
							</p>

							<p className="text-sm text-gray-600 mt-3">
								<span className="font-medium">Skills:</span>{" "}
								{user.skills?.length
									? user.skills.join(", ")
									: "None"}
							</p>
						</div>

						{/* TASKS */}
						<div className="mt-4">
							<h3 className="text-sm font-semibold text-gray-700">
								Assigned Tasks
							</h3>

							{user.assignedTasks.length === 0 ? (
								<p className="text-sm text-gray-400 mt-2">
									No tasks assigned
								</p>
							) : (
								<div className="mt-2 space-y-2">
									{user.assignedTasks.map((task, index) => (
										<div
											key={index}
											className="border rounded p-2 text-sm bg-gray-50"
										>
											<p className="font-medium">
												{task.taskTitle}
											</p>

											<p className="text-gray-600">
												Project: {task.projectTitle}
											</p>

											<p className="text-gray-600">
												Status: {task.taskStatus}
											</p>
										</div>
									))}
								</div>
							)}
						</div>

						{/* ACTIONS (READ-ONLY) */}
						<div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
							<Link
								to={`/users/${user._id}`}
								className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
							>
								View →
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default UserListPage;
