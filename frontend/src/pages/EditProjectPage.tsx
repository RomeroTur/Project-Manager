import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { User } from "../types/User";
import type { Project, Task } from "../types/Project";

const EditProjectPage = () => {
	const { id } = useParams();

	const navigate = useNavigate();

	const [users, setUsers] = useState<User[]>([]);
	const [project, setProject] = useState<Project | null>(null);

	const [projectTitle, setProjectTitle] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	const [projectStatus, setProjectStatus] =
		useState<Project["projectStatus"]>("on hold");

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		const loadData = async () => {
			try {
				const [projectResponse, usersResponse] = await Promise.all([
					fetch(`http://localhost:3000/projects/${id}`, {
						credentials: "include",
					}),
					fetch("http://localhost:3000/users", {
						credentials: "include",
					}),
				]);

				const projectData: Project = await projectResponse.json();

				const usersData: User[] = await usersResponse.json();

				setUsers(usersData);
				setProject(projectData);

				setProjectTitle(projectData.projectTitle);
				setProjectDescription(projectData.projectDescription || "");

				setProjectStatus(projectData.projectStatus);

				setStartDate(
					projectData.startDate
						? new Date(projectData.startDate)
								.toISOString()
								.split("T")[0]
						: "",
				);

				setEndDate(
					projectData.endDate
						? new Date(projectData.endDate)
								.toISOString()
								.split("T")[0]
						: "",
				);

				setTasks(projectData.tasks || []);
			} catch (err) {
				console.error(err);
			}
		};

		loadData();
	}, [id]);

	const updateTask = (index: number, field: keyof Task, value: string) => {
		const updated = [...tasks];

		updated[index] = {
			...updated[index],
			[field]: value,
		};

		setTasks(updated);
	};

	const removeTask = (index: number) => {
		setTasks((prev) => prev.filter((_, i) => i !== index));
	};

	const addTask = () => {
		setTasks((prev) => [
			...prev,
			{
				taskTitle: "",
				taskStatus: "on hold",
				taskMember: "",
				timeSpentRecords: [],
			},
		]);
	};

	const handleDelete = async () => {
		const confirmed = window.confirm("Delete this project permanently?");

		if (!confirmed) {
			return;
		}

		try {
			await fetch(`http://localhost:3000/projects/${id}`, {
				method: "DELETE",
				credentials: "include",
			});

			navigate("/admin/projects");
		} catch (err) {
			console.error(err);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch(
				`http://localhost:3000/projects/${id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						projectTitle,
						projectDescription,
						projectStatus,
						startDate: startDate || null,
						endDate: endDate || null,
						tasks,
					}),
				},
			);

			if (!response.ok) {
				throw new Error("Failed to update project");
			}

			navigate(`/admin/projects/${id}`);
		} catch (err) {
			console.error(err);
		}
	};

	if (!project) {
		return <p>Loading...</p>;
	}

	return (
		<form onSubmit={handleSubmit} className="form grid grid-cols-2 gap-8">
			{/* LEFT SIDE */}

			<div className="space-y-4">
				<h1>Edit Project</h1>

				<div>
					<label>Project Title</label>

					<input
						type="text"
						value={projectTitle}
						onChange={(e) => setProjectTitle(e.target.value)}
					/>
				</div>

				<div>
					<label>Description</label>

					<textarea
						value={projectDescription}
						onChange={(e) => setProjectDescription(e.target.value)}
					/>
				</div>

				<div>
					<label>Status</label>

					<select
						value={projectStatus}
						onChange={(e) =>
							setProjectStatus(
								e.target.value as Project["projectStatus"],
							)
						}
					>
						<option value="on hold">On Hold</option>
						<option value="in process">In Process</option>
						<option value="completed">Completed</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</div>

				<div className="flex gap-4">
					<div>
						<label>Start Date</label>

						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>
					</div>

					<div>
						<label>End Date</label>

						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
						/>
					</div>
				</div>
			</div>

			{/* RIGHT SIDE */}

			<div>
				<div className="flex justify-between mb-4">
					<h2>Tasks</h2>

					<button type="button" onClick={addTask}>
						Add Task
					</button>
				</div>

				{tasks.map((task, index) => (
					<div key={task._id || index} className="border p-4 mb-4">
						<input
							type="text"
							value={task.taskTitle}
							onChange={(e) =>
								updateTask(index, "taskTitle", e.target.value)
							}
						/>

						<select
							value={
								typeof task.taskMember === "string"
									? task.taskMember
									: task.taskMember?._id || ""
							}
							onChange={(e) =>
								updateTask(index, "taskMember", e.target.value)
							}
						>
							<option value="">Select User</option>

							{users.map((user) => (
								<option key={user._id} value={user._id}>
									{user.firstname} {user.lastname}
								</option>
							))}
						</select>

						<select
							value={task.taskStatus}
							onChange={(e) =>
								updateTask(index, "taskStatus", e.target.value)
							}
						>
							<option value="on hold">On Hold</option>

							<option value="in process">In Process</option>

							<option value="completed">Completed</option>

							<option value="cancelled">Cancelled</option>
						</select>

						<button type="button" onClick={() => removeTask(index)}>
							Remove
						</button>
					</div>
				))}
			</div>

			{/* ACTIONS */}

			<div className="col-span-2 flex gap-4">
				<button type="submit">Save Changes</button>

				<button type="button" onClick={() => navigate(-1)}>
					Cancel
				</button>

				<button type="button" onClick={handleDelete}>
					Delete Project
				</button>
			</div>
		</form>
	);
};

export default EditProjectPage;
