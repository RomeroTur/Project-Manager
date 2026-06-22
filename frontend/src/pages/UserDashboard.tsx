import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { DashboardProject } from "../types/DashboardProject";
import type { DashboardUser } from "../types/DashboardUser";

import { API_URL } from "../config/api";

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

const UserDashboard = () => {
	const [projects, setProjects] = useState<DashboardProject[]>([]);
	const [users, setUsers] = useState<DashboardUser[]>([]);

	const [loadingProjects, setLoadingProjects] = useState(true);
	const [loadingUsers, setLoadingUsers] = useState(true);

	useEffect(() => {
		const loadProjects = async () => {
			try {
				const res = await fetch(`${API_URL}/projects/my-projects`, {
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
				const res = await fetch(`${API_URL}/users`, {
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

	const calculateDaysLeft = (endDate?: string) => {
		if (!endDate) return null;

		const today = new Date();
		const end = new Date(endDate);

		return Math.ceil(
			(end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
		);
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* ================= PROJECTS ================= */}

			<div className="space-y-4">
				<h2 className="text-2xl font-bold">My Projects</h2>

				{loadingProjects && (
					<p className="text-gray-500">Loading projects...</p>
				)}

				{projects.map((project) => {
					const deadline = calculateDaysLeft(project.endDate);

					const deadlineStyle = getDeadlineStyle(deadline);

					return (
						<div
							key={project._id}
							className={`bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition flex flex-col ${deadlineStyle.card}`}
						>
							<h3 className="text-lg font-semibold">
								{project.projectTitle}
							</h3>

							<p className="text-sm text-gray-600 mt-1">
								Status: {project.projectStatus}
							</p>

							<div className="mt-3 text-sm text-gray-500 space-y-1">
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

								{deadline !== null && (
									<p
										className={`font-semibold ${deadlineStyle.text}`}
									>
										Deadline: {deadline} days
									</p>
								)}
							</div>

							<div className="mt-4">
								<h4 className="text-sm font-semibold text-gray-700">
									Members
								</h4>

								{project.projectMembers?.length ? (
									<div className="mt-2 text-sm text-gray-600">
										{project.projectMembers.map(
											(member) => (
												<p key={member._id}>
													{member.firstname}{" "}
													{member.lastname}
												</p>
											),
										)}
									</div>
								) : (
									<p className="text-sm text-gray-400 mt-2">
										No members assigned
									</p>
								)}
							</div>

							<div className="mt-auto pt-4 border-t border-gray-100">
								<Link
									to={`/projects/${project._id}`}
									className="inline-block px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
								>
									View →
								</Link>
							</div>
						</div>
					);
				})}
			</div>

			{/* ================= USERS ================= */}

			<div className="space-y-4">
				<h2 className="text-2xl font-bold">Users</h2>

				{loadingUsers && (
					<p className="text-gray-500">Loading users...</p>
				)}

				{users.map((user) => (
					<div
						key={user._id}
						className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition flex flex-col"
					>
						<h3 className="text-lg font-semibold">
							{user.firstname} {user.lastname}
						</h3>

						<div className="mt-2 text-sm text-gray-600 space-y-1">
							<p>Available: {user.available ? "Yes" : "No"}</p>

							<p>
								Skills:{" "}
								{user.skills.length
									? user.skills.join(", ")
									: "-"}
							</p>
						</div>

						<div className="mt-auto pt-4 border-t border-gray-100">
							<Link
								to={`/users/${user._id}`}
								className="inline-block px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
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

export default UserDashboard;
