import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Project, Task } from "../types/Project";

/* =========================
   TYPES
========================= */

type TimeForm = {
	date: string;
	hours: number;
	minutes: number;
};

/* =========================
   COMPONENT
========================= */

const ProjectDetailsPage = () => {
	const DEADLINE_WARNING_DAYS = 14;
	const DEADLINE_CRITICAL_DAYS = 7;

	const { id } = useParams();
	const { user } = useAuth();

	const [project, setProject] = useState<Project | null>(null);
	const [loading, setLoading] = useState(true);

	const [taskForms, setTaskForms] = useState<Record<string, TimeForm>>({});
	const [editingRecord, setEditingRecord] = useState<{
		taskId: string;
		recordId: string;
		form: TimeForm;
	} | null>(null);

	/* =========================
	   LOAD PROJECT
	========================= */

	const loadProject = async () => {
		try {
			const res = await fetch(`http://localhost:3000/projects/${id}`, {
				credentials: "include",
			});

			const data = await res.json();
			setProject(data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		const init = async () => {
			await loadProject();
			setLoading(false);
		};

		init();
	}, [id]);

	/* =========================
	   DEADLINE
	========================= */

	let deadlineDays: number | null = null;

	if (project?.startDate && project?.endDate) {
		const s = new Date(project.startDate).getTime();
		const e = new Date(project.endDate).getTime();

		deadlineDays = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
	}

	/* =========================
	   HELPERS
	========================= */

	const getTaskForm = (taskId: string): TimeForm => {
		return (
			taskForms[taskId] || {
				date: new Date().toISOString().split("T")[0],
				hours: 0,
				minutes: 0,
			}
		);
	};

	const canTrackTime = (task: Task) => {
		if (user?.role === "admin") return true;

		if (!task.taskMember) return false;

		if (typeof task.taskMember === "string") {
			return task.taskMember === user?._id;
		}

		return task.taskMember._id === user?._id;
	};

	/* =========================
	   TIME ACTIONS
	========================= */

	const addTimeRecord = async (taskId: string) => {
		const form = getTaskForm(taskId);

		await fetch(
			`http://localhost:3000/projects/${project!._id}/tasks/${taskId}/time`,
			{
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			},
		);

		setTaskForms((prev) => ({
			...prev,
			[taskId]: {
				date: new Date().toISOString().split("T")[0],
				hours: 0,
				minutes: 0,
			},
		}));

		await loadProject();
	};

	const updateTimeRecord = async () => {
		if (!editingRecord) return;

		await fetch(
			`http://localhost:3000/projects/${project!._id}/tasks/${editingRecord.taskId}/time/${editingRecord.recordId}`,
			{
				method: "PATCH",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(editingRecord.form),
			},
		);

		setEditingRecord(null);
		await loadProject();
	};

	const deleteTimeRecord = async (taskId: string, recordId: string) => {
		await fetch(
			`http://localhost:3000/projects/${project!._id}/tasks/${taskId}/time/${recordId}`,
			{
				method: "DELETE",
				credentials: "include",
			},
		);

		await loadProject();
	};

	/* =========================
	   LOADING
	========================= */

	if (loading) return <p className="p-6">Loading...</p>;
	if (!project) return <p className="p-6">Project not found</p>;

	/* =========================
	   RENDER
	========================= */

	return (
		<>
			{/* NAV */}
			<div className="flex justify-end gap-3 mb-6">
				{user?.role === "admin" && (
					<Link
						to={`/admin/projects/${project._id}/edit`}
						className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
					>
						Edit Project
					</Link>
				)}

				<Link
					to={
						user?.role === "admin" ? "/admin/projects" : "/projects"
					}
					className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition"
				>
					Back
				</Link>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* ================= LEFT SIDE ================= */}

				<div className="space-y-6">
					{/* PROJECT CARD */}
					<div className="bg-white border rounded-lg p-5 shadow-sm">
						<h1 className="text-2xl font-bold">
							{project.projectTitle}
						</h1>

						<p className="text-gray-600 mt-1">
							{project.projectDescription}
						</p>

						<div className="mt-4 text-sm text-gray-600 space-y-1">
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
									? new Date(
											project.endDate,
										).toLocaleDateString()
									: "-"}
							</p>

							{deadlineDays !== null &&
								(() => {
									const style =
										deadlineDays <= DEADLINE_CRITICAL_DAYS
											? "text-red-600"
											: deadlineDays <=
												  DEADLINE_WARNING_DAYS
												? "text-orange-500"
												: "text-gray-700";

									return (
										<p className={`font-semibold ${style}`}>
											<strong>Deadline:</strong> in{" "}
											{deadlineDays} days
										</p>
									);
								})()}
						</div>

						<p className="mt-4 text-sm text-gray-600">
							<span className="font-medium">Assigned to:</span>{" "}
							{project.projectMembers?.length
								? project.projectMembers
										.map((m) =>
											typeof m === "string"
												? m
												: `${m.firstname} ${m.lastname}`,
										)
										.join(", ")
								: "Not assigned"}
						</p>
					</div>
				</div>

				{/* ================= RIGHT SIDE ================= */}
				<div className="bg-white border rounded-lg p-5 shadow-sm">
					<h2 className="text-lg font-semibold mb-4">Tasks</h2>

					{project.tasks.length === 0 && (
						<p className="text-gray-500">No tasks</p>
					)}

					<div className="space-y-3">
						{project.tasks.map((task) => {
							const isEditingThisTask =
								editingRecord?.taskId === task._id;

							return (
								<div
									key={task._id}
									className="border rounded-lg p-4 bg-white shadow-sm"
								>
									{/* TASK HEADER */}
									<div className="mb-3">
										<p className="font-semibold">
											{task.taskTitle}
										</p>
										<p className="text-sm text-gray-500">
											Status: {task.taskStatus}
										</p>
									</div>

									{/* MEMBER */}
									<p className="text-sm text-gray-600 mb-3">
										Assigned to:{" "}
										{!task.taskMember
											? "Unassigned"
											: typeof task.taskMember ===
												  "string"
												? task.taskMember
												: `${task.taskMember.firstname} ${task.taskMember.lastname}`}
									</p>

									{/* =========================
			   TIME RECORDS (TOP)
			========================= */}

									<div className="mb-3">
										<h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
											Time records
										</h4>

										<div className="space-y-1 text-sm">
											{task.timeSpentRecords?.length ? (
												task.timeSpentRecords.map(
													(r) => (
														<div
															key={r._id}
															className="flex justify-between items-center"
														>
															<span className="text-gray-700">
																{new Date(
																	r.date,
																).toLocaleDateString()}{" "}
																| {r.hours}h{" "}
																{r.minutes}m
															</span>

															{canTrackTime(
																task,
															) && (
																<div className="flex gap-2 text-xs">
																	<button
																		type="button"
																		className="text-blue-600 hover:underline"
																		onClick={() =>
																			setEditingRecord(
																				{
																					taskId: task._id!,
																					recordId:
																						r._id!,
																					form: {
																						date: r.date
																							.toString()
																							.split(
																								"T",
																							)[0],
																						hours: r.hours,
																						minutes:
																							r.minutes,
																					},
																				},
																			)
																		}
																	>
																		Edit
																	</button>

																	<button
																		type="button"
																		className="text-red-600 hover:underline"
																		onClick={() =>
																			deleteTimeRecord(
																				task._id!,
																				r._id!,
																			)
																		}
																	>
																		Delete
																	</button>
																</div>
															)}
														</div>
													),
												)
											) : (
												<p className="text-gray-400 text-sm">
													No time records yet
												</p>
											)}
										</div>
									</div>

									{/* =========================
			   EDIT FORM (DIRECTLY BELOW RECORD)
			========================= */}

									{isEditingThisTask && (
										<div className="mb-3 border-t pt-3">
											<h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
												Edit time record
											</h4>

											<div className="flex gap-2">
												<input
													type="date"
													className="border p-1 text-sm"
													value={
														editingRecord!.form.date
													}
													onChange={(e) =>
														setEditingRecord(
															(prev) =>
																prev
																	? {
																			...prev,
																			form: {
																				...prev.form,
																				date: e
																					.target
																					.value,
																			},
																		}
																	: null,
														)
													}
												/>

												<input
													type="number"
													className="border p-1 w-16 text-sm"
													value={
														editingRecord!.form
															.hours
													}
													onChange={(e) =>
														setEditingRecord(
															(prev) =>
																prev
																	? {
																			...prev,
																			form: {
																				...prev.form,
																				hours: Number(
																					e
																						.target
																						.value,
																				),
																			},
																		}
																	: null,
														)
													}
												/>

												<input
													type="number"
													className="border p-1 w-16 text-sm"
													value={
														editingRecord!.form
															.minutes
													}
													onChange={(e) =>
														setEditingRecord(
															(prev) =>
																prev
																	? {
																			...prev,
																			form: {
																				...prev.form,
																				minutes:
																					Number(
																						e
																							.target
																							.value,
																					),
																			},
																		}
																	: null,
														)
													}
												/>

												<button
													onClick={updateTimeRecord}
													className="bg-green-600 text-white px-3 text-sm rounded"
												>
													Save
												</button>

												<button
													onClick={() =>
														setEditingRecord(null)
													}
													className="bg-gray-300 px-3 text-sm rounded"
												>
													Cancel
												</button>
											</div>
										</div>
									)}

									{/* =========================
			   ADD TIME FORM (BOTTOM)
			========================= */}

									{canTrackTime(task) && (
										<div className="border-t pt-3 mt-3">
											<h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
												Add time record
											</h4>

											<div className="flex gap-2">
												<input
													type="date"
													className="border p-1 text-sm"
													value={
														getTaskForm(task._id!)
															.date
													}
													onChange={(e) =>
														setTaskForms(
															(prev) => ({
																...prev,
																[task._id!]: {
																	...getTaskForm(
																		task._id!,
																	),
																	date: e
																		.target
																		.value,
																},
															}),
														)
													}
												/>

												<input
													type="number"
													placeholder="h"
													className="border p-1 w-16 text-sm"
													value={
														getTaskForm(task._id!)
															.hours
													}
													onChange={(e) =>
														setTaskForms(
															(prev) => ({
																...prev,
																[task._id!]: {
																	...getTaskForm(
																		task._id!,
																	),
																	hours: Number(
																		e.target
																			.value,
																	),
																},
															}),
														)
													}
												/>

												<input
													type="number"
													placeholder="m"
													className="border p-1 w-16 text-sm"
													value={
														getTaskForm(task._id!)
															.minutes
													}
													onChange={(e) =>
														setTaskForms(
															(prev) => ({
																...prev,
																[task._id!]: {
																	...getTaskForm(
																		task._id!,
																	),
																	minutes:
																		Number(
																			e
																				.target
																				.value,
																		),
																},
															}),
														)
													}
												/>

												<button
													onClick={() =>
														addTimeRecord(task._id!)
													}
													className="bg-blue-600 text-white px-3 text-sm rounded"
												>
													Add
												</button>
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default ProjectDetailsPage;
