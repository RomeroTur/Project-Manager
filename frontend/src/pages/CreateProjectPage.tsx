import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { User } from "../types/User";
import type { Task } from "../types/Project";

const CreateProjectPage = () => {
	const navigate = useNavigate();

	const [users, setUsers] = useState<User[]>([]);

	const [projectTitle, setProjectTitle] = useState("");
	const [projectDescription, setProjectDescription] = useState("");

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		const loadUsers = async () => {
			try {
				const response = await fetch("http://localhost:3000/users", {
					credentials: "include",
				});

				const data = await response.json();

				setUsers(data);
			} catch (err) {
				console.error(err);
			}
		};

		loadUsers();
	}, []);

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

	const updateTask = (index: number, field: keyof Task, value: any) => {
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const payload = {
				projectTitle,
				projectDescription,

				projectStatus: "on hold",

				projectMembers: [
					...new Set(tasks.map((t) => t.taskMember).filter(Boolean)),
				],

				startDate: startDate || undefined,
				endDate: endDate || undefined,

				tasks: tasks.map((t) => ({
					taskTitle: t.taskTitle,
					taskMember: t.taskMember || undefined,
					taskStatus: "on hold",
				})),

				comments: [],
			};

			const response = await fetch(
				"http://localhost:3000/projects/create",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(payload),
				},
			);

			if (!response.ok) {
				const err = await response.json();
				console.error(err);
				throw new Error("Failed to create project");
			}

			navigate("/admin/projects");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
			{/* LEFT SIDE */}

			<div className="space-y-4">
				<h1>Create Project</h1>

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
					<div key={index} className="border p-4 mb-4">
						<div>
							<label>Task Title</label>

							<input
								type="text"
								value={task.taskTitle}
								onChange={(e) =>
									updateTask(
										index,
										"taskTitle",
										e.target.value,
									)
								}
							/>
						</div>

						<div>
							<label>Assigned User</label>

							<select
								value={task.taskMember || ""}
								onChange={(e) =>
									updateTask(
										index,
										"taskMember",
										e.target.value,
									)
								}
							>
								<option value="">Select User</option>

								{users.map((user) => (
									<option key={user._id} value={user._id}>
										{user.firstname} {user.lastname}
									</option>
								))}
							</select>
						</div>

						<button type="button" onClick={() => removeTask(index)}>
							Remove Task
						</button>
					</div>
				))}
			</div>

			{/* ACTIONS */}

			<div className="col-span-2 flex gap-4">
				<button type="submit">Create Project</button>

				<button type="button" onClick={() => navigate(-1)}>
					Cancel
				</button>
			</div>
		</form>
	);
};

export default CreateProjectPage;
