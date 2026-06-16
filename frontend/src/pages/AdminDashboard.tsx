import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { DashboardProject } from "../types/DashboardProject";
import type { DashboardUser } from "../types/DashboardUser";

const AdminDashboard = () => {
	const [projects, setProjects] = useState<DashboardProject[]>([]);
	const [users, setUsers] = useState<DashboardUser[]>([]);

	const [loadingProjects, setLoadingProjects] = useState(true);
	const [loadingUsers, setLoadingUsers] = useState(true);

	useEffect(() => {
		const loadProjects = async () => {
			try {
				const res = await fetch("http://localhost:3000/projects", {
					credentials: "include",
				});

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

	const calculateDaysLeft = (startDate?: string, endDate?: string) => {
		if (!startDate || !endDate) {
			return "-";
		}

		const start = new Date(startDate);
		const end = new Date(endDate);

		const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

		return Math.round(diff);
	};

	return (
		<div className="grid grid-cols-2 gap-8">
			<div>
				<h2 className="text-2xl font-bold mb-4">Projects</h2>

				{loadingProjects && <p>Loading projects...</p>}

				{projects.map((project) => (
					<div key={project._id} className="border rounded p-4 mb-4">
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
								? new Date(project.endDate).toLocaleDateString()
								: "-"}
						</p>

						<p>
							Deadline:{" "}
							{calculateDaysLeft(
								project.startDate,
								project.endDate,
							)}{" "}
							days
						</p>

						<p>Members: {project.projectMembers?.length ?? 0}</p>

						<Link
							to={`/admin/projects/${project._id}`}
							className="inline-block mt-2"
						>
							View
						</Link>
						<Link
							to={`/admin/projects/${project._id}/edit`}
							className="inline-block mt-2"
						>
							Edit
						</Link>
					</div>
				))}
			</div>

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
							{user.skills.length > 0
								? user.skills.join(", ")
								: "-"}
						</p>

						<Link
							to={`/admin/users/${user._id}`}
							className="inline-block mt-2"
						>
							View
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};

export default AdminDashboard;
