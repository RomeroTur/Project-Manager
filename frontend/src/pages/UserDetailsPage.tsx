import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types/User";

import { API_URL } from "../config/api";

const UserDetailsPage = () => {
	const { id } = useParams();
	const { user: authUser } = useAuth();
	const navigate = useNavigate();

	const isProfile = !id;
	const targetId = isProfile ? "me" : id;

	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const load = async () => {
			const url = isProfile
				? `${API_URL}/users/me`
				: `${API_URL}/users/${targetId}`;

			const res = await fetch(url, {
				credentials: "include",
			});

			const data = await res.json();
			setUser(data);
		};

		load();
	}, [id]);

	if (!user) return <p className="text-gray-500">Loading...</p>;

	return (
		<>
			{/* HEADER */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<h1 className="text-2xl font-bold ">
					{user.firstname} {user.lastname}
				</h1>

				{/* =========================
					ACTIONS
				========================= */}

				<div className="flex gap-3 lg:justify-end items-center">
					{authUser?.role === "admin" && (
						<Link
							to={`/admin/users/${user._id}/edit`}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
						>
							Edit User
						</Link>
					)}

					<button
						onClick={() => navigate(-1)}
						className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
					>
						Back
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* =========================
				LEFT SIDE - USER INFO
			========================= */}
				<div className="space-y-6">
					{/* INFO CARD */}
					<div className="bg-white border rounded-lg p-5 shadow-sm space-y-2">
						<h2 className="text-lg font-semibold mb-2">
							User Information
						</h2>

						<p>
							<span className="font-medium">Role:</span>{" "}
							{user.role}
						</p>

						<p>
							<span className="font-medium">Available:</span>{" "}
							{user.available ? "Yes" : "No"}
						</p>

						<p>
							<span className="font-medium">Email:</span>{" "}
							{user.email}
						</p>

						<p>
							<span className="font-medium">Birthday:</span>{" "}
							{user.personal?.birthday
								? new Date(
										user.personal.birthday,
									).toLocaleDateString()
								: "Not set"}
						</p>

						<p>
							<span className="font-medium">Telephone:</span>{" "}
							{user.personal?.tel || "Not set"}
						</p>

						<p>
							<span className="font-medium">Address:</span>{" "}
							{user.personal?.address || "Not set"}
						</p>

						<p>
							<span className="font-medium">Description:</span>{" "}
							{user.personal?.description || "Not set"}
						</p>

						<p>
							<span className="font-medium">Skills:</span>{" "}
							{user.skills.length
								? user.skills.join(", ")
								: "No skills assigned"}
						</p>
					</div>
				</div>

				{/* =========================
				RIGHT SIDE - TASKS
			========================= */}
				<div className="space-y-6">
					<div className="bg-white border rounded-lg p-5 shadow-sm">
						<h2 className="text-lg font-semibold mb-4">
							Assigned Tasks
						</h2>

						{!user.assignedTasks?.length ? (
							<p className="text-sm text-gray-500">
								No tasks assigned
							</p>
						) : (
							<div className="space-y-3">
								{user.assignedTasks.map((task, index) => (
									<div
										key={`${task.projectId}-${index}`}
										className="border rounded-md p-3 bg-gray-50 text-sm"
									>
										<p className="font-medium">
											{task.projectTitle}
										</p>

										<p className="text-gray-700">
											{task.taskTitle}
										</p>

										<p className="text-gray-600">
											Status: {task.taskStatus}
										</p>

										<p className="text-gray-500">
											Time spent:{" "}
											{task.timeSpentTotal || "0h 0m"}
										</p>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default UserDetailsPage;
