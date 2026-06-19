import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import type { User } from "../types/User";

/* =========================
   ZOD VALIDATION
========================= */
const ProjectCreateSchema = z
	.object({
		projectTitle: z.string().min(3, "Title must be at least 3 characters"),

		projectDescription: z.string().optional(),

		startDate: z.string().optional().nullable(),
		endDate: z.string().optional().nullable(),

		tasks: z
			.array(
				z.object({
					taskTitle: z.string().min(1, "Task title is required"),
					taskMember: z.string().nullable().optional(),
				}),
			)
			.optional(),
	})
	.refine(
		(data) => {
			const start = data.startDate;
			const end = data.endDate;

			// both or none
			return (!start && !end) || (!!start && !!end);
		},
		{
			message: "Start date and end date must be set together",
			path: ["startDate"],
		},
	);

type TaskForm = {
	taskTitle: string;
	taskMember: string;
	taskStatus: "on hold";
};

const CreateProjectPage = () => {
	const navigate = useNavigate();

	const [users, setUsers] = useState<User[]>([]);
	const [error, setError] = useState<string | null>(null);

	const [projectTitle, setProjectTitle] = useState("");
	const [projectDescription, setProjectDescription] = useState("");

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const [tasks, setTasks] = useState<TaskForm[]>([]);

	/* =========================
	   LOAD USERS
	========================= */
	useEffect(() => {
		const loadUsers = async () => {
			try {
				const res = await fetch("http://localhost:3000/users", {
					credentials: "include",
				});

				const data = await res.json();
				setUsers(data);
			} catch (err) {
				console.error(err);
			}
		};

		loadUsers();
	}, []);

	/* =========================
	   TASK HANDLERS
	========================= */
	const addTask = () => {
		setTasks((prev) => [
			...prev,
			{
				taskTitle: "",
				taskMember: "",
				taskStatus: "on hold",
			},
		]);
	};

	const updateTask = (
		index: number,
		field: keyof TaskForm,
		value: string,
	) => {
		setTasks((prev) => {
			const copy = [...prev];
			copy[index] = { ...copy[index], [field]: value };
			return copy;
		});
	};

	const removeTask = (index: number) => {
		setTasks((prev) => prev.filter((_, i) => i !== index));
	};

	/* =========================
	   SUBMIT
	========================= */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// normalize empty dates → null
		const start = startDate.trim() === "" ? null : startDate;
		const end = endDate.trim() === "" ? null : endDate;

		const parsed = ProjectCreateSchema.safeParse({
			projectTitle,
			projectDescription,
			startDate: start,
			endDate: end,
			tasks,
		});

		if (!parsed.success) {
			setError(parsed.error.issues.map((i) => i.message).join(", "));
			return;
		}

		// derive members ONLY from tasks
		const projectMembers = [
			...new Set(
				tasks
					.map((t) => t.taskMember)
					.filter((v): v is string => Boolean(v)),
			),
		];

		const payload = {
			projectTitle,
			projectDescription,
			projectStatus: "on hold",

			projectMembers,

			startDate: start ? new Date(start).toISOString() : undefined,
			endDate: end ? new Date(end).toISOString() : undefined,

			tasks: tasks.map((t) => ({
				taskTitle: t.taskTitle,
				taskMember: t.taskMember ? t.taskMember : undefined,
				taskStatus: "on hold",
			})),

			comments: [],
		};

		try {
			const res = await fetch("http://localhost:3000/projects/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				console.error(err);
				setError("Failed to create project");
				return;
			}

			navigate("/admin/projects");
		} catch (err) {
			console.error(err);
			setError("Server error");
		}
	};

	/* =========================
	   UI
	========================= */
	return (
		<form
			onSubmit={handleSubmit}
			className="grid grid-cols-1 lg:grid-cols-2 gap-6"
		>
			{/* =========================
		   LEFT SIDE - PROJECT INFO CARD
		========================= */}
			<div className="bg-white border rounded-lg p-5 shadow-sm space-y-4">
				<h1 className="text-2xl font-bold">Create Project</h1>

				{error && (
					<p className="text-red-500 font-medium text-sm">{error}</p>
				)}

				<div className="space-y-3">
					<input
						className="w-full border p-2 rounded"
						placeholder="Project title"
						value={projectTitle}
						onChange={(e) => setProjectTitle(e.target.value)}
					/>

					<textarea
						className="w-full border p-2 rounded min-h-[120px]"
						placeholder="Description"
						value={projectDescription}
						onChange={(e) => setProjectDescription(e.target.value)}
					/>

					<div className="flex gap-3">
						<input
							type="date"
							className="w-full border p-2 rounded"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>

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
		   RIGHT SIDE - TASKS CARD
		========================= */}
			<div className="bg-white border rounded-lg p-5 shadow-sm">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold">Tasks</h2>

					<button
						type="button"
						onClick={addTask}
						className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
					>
						Add Task
					</button>
				</div>

				{tasks.length === 0 && (
					<p className="text-sm text-gray-500">No tasks added yet</p>
				)}

				<div className="space-y-3">
					{tasks.map((task, i) => (
						<div
							key={i}
							className="border rounded-md p-3 bg-gray-50 space-y-2"
						>
							<input
								className="w-full border p-2 rounded"
								placeholder="Task title"
								value={task.taskTitle}
								onChange={(e) =>
									updateTask(i, "taskTitle", e.target.value)
								}
							/>

							<select
								className="w-full border p-2 rounded"
								value={task.taskMember}
								onChange={(e) =>
									updateTask(i, "taskMember", e.target.value)
								}
							>
								<option value="">Unassigned</option>

								{users.map((u) => (
									<option key={u._id} value={u._id}>
										{u.firstname} {u.lastname}
									</option>
								))}
							</select>

							<button
								type="button"
								onClick={() => removeTask(i)}
								className="text-sm text-red-600 hover:text-red-800"
							>
								Delete Task
							</button>
						</div>
					))}
				</div>
			</div>

			{/* =========================
		   ACTIONS (FULL WIDTH)
		========================= */}
			<div className="lg:col-span-2 flex justify-end gap-3">
				<button
					type="button"
					onClick={() => navigate(-1)}
					className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
				>
					Cancel
				</button>

				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
				>
					Create Project
				</button>
			</div>
		</form>
	);
};

export default CreateProjectPage;
