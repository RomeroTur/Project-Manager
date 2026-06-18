import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import type { Project } from "../types/Project";

/* =========================
   TIME TRACKING TYPES
========================= */

type TimeForm = {
	date: string;
	hours: number;
	minutes: number;
};

const ProjectDetailsPage = () => {
	const { id } = useParams();
	const { user } = useAuth();
	const [project, setProject] = useState<Project | null>(null);
	const [loading, setLoading] = useState(true);

	/* =========================
	   TIME TRACKING STATE
	========================= */

	const [timeForm, setTimeForm] = useState<TimeForm>({
		date: new Date().toISOString().split("T")[0],
		hours: 0,
		minutes: 0,
	});

	const [editingRecord, setEditingRecord] = useState<{
		taskId: string;
		recordId: string;
		form: TimeForm;
	} | null>(null);

	useEffect(() => {
		const load = async () => {
			try {
				const res = await fetch(
					`http://localhost:3000/projects/${id}`,
					{ credentials: "include" },
				);

				const data = await res.json();
				setProject(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		load();
	}, [id]);

	/* =========================
	   LOADING STATE
	========================= */

	if (loading) return <p>Loading...</p>;
	if (!project) return <p>Project not found</p>;

	/* =========================
	   DEADLINE CALC
	========================= */

	let deadlineDays: number | null = null;

	if (project.startDate && project.endDate) {
		const startTime = new Date(project.startDate).getTime();
		const endTime = new Date(project.endDate).getTime();

		deadlineDays = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
	}

	/* =========================
	   TIME TRACKING FUNCTIONS
	========================= */

	const resetForm = () => {
		setTimeForm({
			date: new Date().toISOString().split("T")[0],
			hours: 0,
			minutes: 0,
		});
	};

	const addTimeRecord = async (taskId: string) => {
		await fetch(
			`http://localhost:3000/projects/${project._id}/tasks/${taskId}/time`,
			{
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(timeForm),
			},
		);

		resetForm();
		window.location.reload();
	};

	const updateTimeRecord = async () => {
		if (!editingRecord) return;

		await fetch(
			`http://localhost:3000/projects/${project._id}/tasks/${editingRecord.taskId}/time/${editingRecord.recordId}`,
			{
				method: "PATCH",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(editingRecord.form),
			},
		);

		setEditingRecord(null);
		window.location.reload();
	};

	const deleteTimeRecord = async (taskId: string, recordId: string) => {
		await fetch(
			`http://localhost:3000/projects/${project._id}/tasks/${taskId}/time/${recordId}`,
			{
				method: "DELETE",
				credentials: "include",
			},
		);

		window.location.reload();
	};

	/* =========================
	   RENDER
	========================= */

	return (
		<div className="space-y-6">
			{/* PROJECT HEADER */}
			<div>
				<h1 className="text-2xl font-bold">{project.projectTitle}</h1>
				<p>{project.projectDescription}</p>
			</div>

			{/* PROJECT INFO */}
			<div className="border p-4">
				<p>
					<strong>Status:</strong> {project.projectStatus}
				</p>

				<p>
					<strong>Start:</strong>{" "}
					{project.startDate
						? new Date(project.startDate).toLocaleDateString()
						: "Not set"}
				</p>

				<p>
					<strong>End:</strong>{" "}
					{project.endDate
						? new Date(project.endDate).toLocaleDateString()
						: "Not set"}
				</p>

				{deadlineDays !== null && (
					<p>
						<strong>Deadline:</strong> {deadlineDays} days
					</p>
				)}

				<p>
					<strong>Members:</strong>{" "}
					{project.projectMembers?.length
						? project.projectMembers
								.map((m) =>
									typeof m === "string"
										? m
										: `${m.firstname} ${m.lastname}`,
								)
								.join(", ")
						: "Not assigned yet"}
				</p>
			</div>

			{/* TASKS */}
			<div>
				<h2 className="font-semibold">Tasks</h2>

				{project.tasks.length === 0 && <p>No tasks</p>}

				{project.tasks.map((task) => (
					<div key={task._id} className="border p-4 mt-2">
						<p>
							<strong>{task.taskTitle}</strong>
						</p>

						<p>Status: {task.taskStatus}</p>

						<p>
							Member:{" "}
							{!task.taskMember
								? "Unassigned"
								: typeof task.taskMember === "string"
									? task.taskMember
									: `${task.taskMember.firstname} ${task.taskMember.lastname}`}
						</p>

						{/* =========================
						   ADD TIME RECORD
						========================= */}

						<div className="flex gap-2 mt-3">
							<input
								type="date"
								className="border p-1"
								value={timeForm.date}
								onChange={(e) =>
									setTimeForm((p) => ({
										...p,
										date: e.target.value,
									}))
								}
							/>

							<input
								type="number"
								placeholder="Hours"
								className="border p-1 w-20"
								value={timeForm.hours}
								onChange={(e) =>
									setTimeForm((p) => ({
										...p,
										hours: Number(e.target.value),
									}))
								}
							/>

							<input
								type="number"
								placeholder="Minutes"
								className="border p-1 w-20"
								value={timeForm.minutes}
								onChange={(e) =>
									setTimeForm((p) => ({
										...p,
										minutes: Number(e.target.value),
									}))
								}
							/>

							<button
								className="bg-blue-500 text-white px-3"
								onClick={() => addTimeRecord(task._id!)}
							>
								Add
							</button>
						</div>

						{/* =========================
						   TIME RECORDS
						========================= */}

						<div className="mt-3 space-y-2">
							{task.timeSpentRecords?.map((r) => (
								<div
									key={r._id}
									className="border p-2 flex justify-between"
								>
									<div>
										<p>
											{new Date(
												r.date,
											).toLocaleDateString()}
										</p>
										<p>
											{r.hours}h {r.minutes}m
										</p>
									</div>

									<div className="flex gap-2">
										<button
											className="text-blue-600"
											onClick={() =>
												setEditingRecord({
													taskId: task._id!,
													recordId: r._id!,
													form: {
														date: r.date
															.toString()
															.split("T")[0],
														hours: r.hours,
														minutes: r.minutes,
													},
												})
											}
										>
											Edit
										</button>

										<button
											className="text-red-600"
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
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			{/* =========================
			   EDIT MODAL
			========================= */}

			{editingRecord && (
				<div className="border p-4 bg-gray-50">
					<h3 className="font-semibold mb-2">Edit Time Record</h3>

					<div className="flex gap-2">
						<input
							type="date"
							className="border p-1"
							value={editingRecord.form.date}
							onChange={(e) =>
								setEditingRecord((p) =>
									p
										? {
												...p,
												form: {
													...p.form,
													date: e.target.value,
												},
											}
										: null,
								)
							}
						/>

						<input
							type="number"
							className="border p-1 w-20"
							value={editingRecord.form.hours}
							onChange={(e) =>
								setEditingRecord((p) =>
									p
										? {
												...p,
												form: {
													...p.form,
													hours: Number(
														e.target.value,
													),
												},
											}
										: null,
								)
							}
						/>

						<input
							type="number"
							className="border p-1 w-20"
							value={editingRecord.form.minutes}
							onChange={(e) =>
								setEditingRecord((p) =>
									p
										? {
												...p,
												form: {
													...p.form,
													minutes: Number(
														e.target.value,
													),
												},
											}
										: null,
								)
							}
						/>

						<button
							className="bg-green-600 text-white px-3"
							onClick={updateTimeRecord}
						>
							Save
						</button>

						<button
							className="bg-gray-400 text-white px-3"
							onClick={() => setEditingRecord(null)}
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			{/* NAV */}
			<div className="flex gap-3">
				{user?.role === "admin" && (
					<Link to={`/admin/projects/${project._id}/edit`}>Edit</Link>
				)}

				<Link
					to={
						user?.role === "admin" ? "/admin/projects" : "/projects"
					}
				>
					Back
				</Link>
			</div>
		</div>
	);
};

export default ProjectDetailsPage;
