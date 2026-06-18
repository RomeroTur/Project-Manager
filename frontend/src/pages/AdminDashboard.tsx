import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { DashboardProject } from "../types/DashboardProject";
import type { DashboardUser } from "../types/DashboardUser";

const AdminDashboard = () => {
	const [projects, setProjects] = useState<DashboardProject[]>([]);
	const [users, setUsers] = useState<DashboardUser[]>([]);

	const [loadingProjects, setLoadingProjects] = useState(true);
	const [loadingUsers, setLoadingUsers] = useState(true);

	/* =========================
	   UX CONFIG (EASY TUNING)
	========================= */

	const DEADLINE_WARNING_DAYS = 14;
	const DEADLINE_CRITICAL_DAYS = 7;

	/* =========================
	   DEADLINE LOGIC
	========================= */

	const calculateDaysLeft = (startDate?: string, endDate?: string) => {
		if (!startDate || !endDate) return null;

		const start = new Date(startDate);
		const end = new Date(endDate);

		return Math.ceil(
			(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
		);
	};

	const getDeadlineStyle = (days: number | null) => {
		if (days === null) return { text: "", card: "" };

		if (days <= DEADLINE_CRITICAL_DAYS) {
			return {
				text: "text-red-600 font-semibold",
				card: "shadow-red-200 border-red-200",
			};
		}

		if (days <= DEADLINE_WARNING_DAYS) {
			return {
				text: "text-orange-500 font-medium",
				card: "shadow-orange-100 border-orange-200",
			};
		}

		return {
			text: "text-gray-600",
			card: "",
		};
	};

	/* =========================
	   DATA LOAD
	========================= */

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

	/* =========================
	   RENDER
	========================= */

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* ================= PROJECTS ================= */}
			<div>
				<h2 className="text-2xl font-bold mb-4">Projects</h2>

				{loadingProjects && (
					<p className="text-gray-500">Loading projects...</p>
				)}

				<div className="space-y-4">
					{projects.map((project) => {
						const daysLeft = calculateDaysLeft(
							project.startDate,
							project.endDate,
						);

						const deadlineStyle = getDeadlineStyle(daysLeft);

						return (
							<div
								key={project._id}
								className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition ${deadlineStyle.card}`}
							>
								{/* TITLE */}
								<h3 className="text-lg font-semibold">
									{project.projectTitle}
								</h3>

								{/* STATUS */}
								<p className="text-sm text-gray-500">
									Status: {project.projectStatus}
								</p>

								{/* DATES */}
								<div className="text-sm text-gray-600 mt-2 space-y-1">
									<p>
										Start:{" "}
										{project.startDate
											? new Date(
													project.startDate,
												).toLocaleDateString()
											: "Not set"}
									</p>

									<p>
										End:{" "}
										{project.endDate
											? new Date(
													project.endDate,
												).toLocaleDateString()
											: "Not set"}
									</p>

									{daysLeft !== null && (
										<p className={deadlineStyle.text}>
											Deadline: in {daysLeft} days
										</p>
									)}
								</div>

								{/* MEMBERS */}
								<p className="text-sm text-gray-600 mt-2">
									<span className="font-medium">
										Assigned to:
									</span>{" "}
									{project.projectMembers?.length
										? project.projectMembers
												.map((member) =>
													typeof member === "string"
														? member
														: `${member.firstname} ${member.lastname}`,
												)
												.join(", ")
										: "not assigned"}
								</p>

								{/* ACTIONS */}
								<div className="flex gap-3 mt-4">
									<Link
										to={`/admin/projects/${project._id}`}
										className="text-sm text-blue-600 hover:underline"
									>
										View →
									</Link>

									<Link
										to={`/admin/projects/${project._id}/edit`}
										className="text-sm text-gray-600 hover:underline"
									>
										Edit
									</Link>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* ================= USERS ================= */}
			<div>
				<h2 className="text-2xl font-bold mb-4">Users</h2>

				{loadingUsers && (
					<p className="text-gray-500">Loading users...</p>
				)}

				<div className="space-y-4">
					{users.map((user) => (
						<div
							key={user._id}
							className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
						>
							<h3 className="text-lg font-semibold">
								{user.firstname} {user.lastname}
							</h3>

							<p className="text-sm text-gray-500">
								Available: {user.available ? "Yes" : "No"}
							</p>

							<p className="text-sm text-gray-600 mt-1">
								Skills:{" "}
								{user.skills.length > 0
									? user.skills.join(", ")
									: "None"}
							</p>

							<div className="flex gap-3 mt-4">
								<Link
									to={`/admin/users/${user._id}`}
									className="text-sm text-blue-600 hover:underline"
								>
									View →
								</Link>

								<Link
									to={`/admin/users/${user._id}/edit`}
									className="text-sm text-gray-600 hover:underline"
								>
									Edit
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
