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

	/* =========================
	   LOAD DATA
	========================= */
	useEffect(() => {
		const loadData = async () => {
			const [projectRes, usersRes] = await Promise.all([
				fetch(`http://localhost:3000/projects/${id}`, {
					credentials: "include",
				}),
				fetch("http://localhost:3000/users", {
					credentials: "include",
				}),
			]);

			const projectData: Project = await projectRes.json();
			const usersData: User[] = await usersRes.json();

			setProject(projectData);
			setUsers(usersData);

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
					? new Date(projectData.endDate).toISOString().split("T")[0]
					: "",
			);

			setTasks(projectData.tasks || []);
		};

		loadData();
	}, [id]);

	/* =========================
	   TASK HANDLERS
	========================= */

	const updateTask = <K extends keyof Task>(
		index: number,
		field: K,
		value: Task[K],
	) => {
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

	/* =========================
	   DELETE PROJECT
	========================= */
	const handleDelete = async () => {
		if (!window.confirm("Delete this project permanently?")) return;

		await fetch(`http://localhost:3000/projects/${id}`, {
			method: "DELETE",
			credentials: "include",
		});

		navigate("/admin/projects");
	};

	/* =========================
	   SAVE
	========================= */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await fetch(`http://localhost:3000/projects/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				projectTitle,
				projectDescription,
				projectStatus,
				startDate: startDate || null,
				endDate: endDate || null,
				tasks: tasks.map((t) => ({
					...t,
					taskMember:
						typeof t.taskMember === "string"
							? t.taskMember || undefined
							: t.taskMember?._id || undefined,
				})),
			}),
		});

		navigate(`/admin/projects/${id}`);
	};

	if (!project) return <p>Loading...</p>;

	/* =========================
	   RENDER
	========================= */

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="grid grid-cols-1 lg:grid-cols-2 gap-6"
			>
				{/* =========================
			   ACTIONS
			========================= */}
				<div className="col-span-1 lg:col-span-2 flex gap-3 justify-end">
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Save Changes
					</button>

					<button
						type="button"
						onClick={() => navigate(-1)}
						className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
					>
						Cancel
					</button>

					<button
						type="button"
						onClick={handleDelete}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
					>
						Delete Project
					</button>
				</div>
				{/* =========================
			   LEFT SIDE - PROJECT INFO
			========================= */}
				<div className="bg-white border rounded-lg p-5 shadow-sm space-y-4">
					<h1 className="text-xl font-bold">Edit {projectTitle}</h1>

					<div>
						<label className="text-sm text-gray-600">Title</label>
						<input
							className="w-full border p-2 rounded"
							value={projectTitle}
							onChange={(e) => setProjectTitle(e.target.value)}
						/>
					</div>

					<div>
						<label className="text-sm text-gray-600">
							Description
						</label>
						<textarea
							className="w-full border p-2 rounded"
							value={projectDescription}
							onChange={(e) =>
								setProjectDescription(e.target.value)
							}
						/>
					</div>

					<div>
						<label className="text-sm text-gray-600">Status</label>
						<select
							className="w-full border p-2 rounded"
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
						<div className="flex-1">
							<label className="text-sm text-gray-600">
								Start Date
							</label>
							<input
								type="date"
								className="w-full border p-2 rounded"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
							/>
						</div>

						<div className="flex-1">
							<label className="text-sm text-gray-600">
								End Date
							</label>
							<input
								type="date"
								className="w-full border p-2 rounded"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</div>
					</div>
				</div>

				{/* =========================
			   RIGHT SIDE - TASKS
			========================= */}
				<div className="bg-white border rounded-lg p-5 shadow-sm">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">Tasks</h2>
					</div>

					<div className="space-y-4">
						{tasks.map((task, index) => (
							<div
								key={task._id || index}
								className="border rounded p-4 bg-gray-50 space-y-2"
							>
								<input
									className="w-full border p-2 rounded"
									value={task.taskTitle}
									onChange={(e) =>
										updateTask(
											index,
											"taskTitle",
											e.target.value,
										)
									}
									placeholder="Task title"
								/>

								<select
									className="w-full border p-2 rounded"
									value={
										typeof task.taskMember === "string"
											? task.taskMember
											: task.taskMember?._id || ""
									}
									onChange={(e) =>
										updateTask(
											index,
											"taskMember",
											e.target.value,
										)
									}
								>
									<option value="">Unassigned</option>
									{users.map((u) => (
										<option key={u._id} value={u._id}>
											{u.firstname} {u.lastname}
										</option>
									))}
								</select>

								<select
									className="w-full border p-2 rounded"
									value={task.taskStatus}
									onChange={(e) =>
										updateTask(
											index,
											"taskStatus",
											e.target
												.value as Task["taskStatus"],
										)
									}
								>
									<option value="on hold">On Hold</option>
									<option value="in process">
										In Process
									</option>
									<option value="completed">Completed</option>
									<option value="cancelled">Cancelled</option>
								</select>

								<button
									type="button"
									onClick={() => removeTask(index)}
									className="text-red-600 text-sm hover:underline"
								>
									Remove task
								</button>
							</div>
						))}
					</div>
					<div className="flex justify-end items-center mt-4">
						<button
							type="button"
							onClick={addTask}
							className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
						>
							+ Add Task
						</button>
					</div>
				</div>
			</form>
		</>
	);
};

export default EditProjectPage;
