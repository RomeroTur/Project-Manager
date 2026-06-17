import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { User } from "../types/User";

const UserDetailsPage = () => {
	const { id } = useParams();

	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const load = async () => {
			const res = await fetch(`http://localhost:3000/users/${id}`, {
				credentials: "include",
			});

			const data = await res.json();
			setUser(data);
		};

		load();
	}, [id]);

	if (!user) {
		return <p>Loading...</p>;
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">
					{user.firstname} {user.lastname}
				</h1>
			</div>

			<div className="border p-4">
				<h2 className="font-semibold mb-2">User Information</h2>

				<p>
					<strong>Role:</strong> {user.role}
				</p>

				<p>
					<strong>Available:</strong> {user.available ? "Yes" : "No"}
				</p>

				<p>
					<strong>Email:</strong> {user.email}
				</p>

				<p>
					<strong>Birthday:</strong>{" "}
					{user.personal?.birthday
						? new Date(user.personal.birthday).toLocaleDateString()
						: "Not set"}
				</p>

				<p>
					<strong>Telephone:</strong>{" "}
					{user.personal?.tel || "Not set"}
				</p>

				<p>
					<strong>Address:</strong>{" "}
					{user.personal?.address || "Not set"}
				</p>

				<p>
					<strong>Description:</strong>{" "}
					{user.personal?.description || "Not set"}
				</p>

				<p>
					<strong>Skills:</strong>{" "}
					{user.skills.length
						? user.skills.join(", ")
						: "No skills assigned"}
				</p>
			</div>

			<div className="border p-4">
				<h2 className="font-semibold mb-2">Assigned Tasks</h2>

				{!user.assignedTasks?.length && <p>No tasks assigned</p>}

				{user.assignedTasks?.map((task, index) => (
					<div
						key={`${task.projectId}-${index}`}
						className="border p-3 mb-2"
					>
						<p>
							<strong>Project:</strong> {task.projectTitle}
						</p>

						<p>
							<strong>Task:</strong> {task.taskTitle}
						</p>

						<p>
							<strong>Status:</strong> {task.taskStatus}
						</p>

						<p>
							<strong>Time Spent:</strong>{" "}
							{task.timeSpentTotal || "0h 0m"}
						</p>
					</div>
				))}
			</div>

			<div>
				<Link
					to={`/admin/users/${user._id}/edit`}
					className="border px-3 py-1"
				>
					Edit User
				</Link>
			</div>
		</div>
	);
};

export default UserDetailsPage;
