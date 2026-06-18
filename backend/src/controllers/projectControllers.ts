import { RequestHandler } from "express";
import { Project, User, ProjectCreateCheckSchema } from "#models";
import { AppError } from "#utils";

/* =========================
   HELPERS
========================= */

const safeDate = (value: any): Date | undefined => {
	if (!value) return undefined;

	const date = new Date(value);
	if (isNaN(date.getTime())) return undefined;

	return date;
};

const extractMembersFromTasks = (tasks: any[] = []) => {
	const set = new Set<string>();

	for (const task of tasks) {
		if (task?.taskMember) {
			set.add(task.taskMember);
		}
	}

	return [...set];
};

const calculateUserAvailability = (projects: any[]) => {
	const userBusyMap = new Map<string, boolean>();

	for (const project of projects) {
		for (const task of project.tasks || []) {
			if (!task?.taskMember) continue;

			const userId =
				typeof task.taskMember === "string"
					? task.taskMember
					: task.taskMember?._id?.toString?.() ||
						task.taskMember.toString();

			const isInProcess = task.taskStatus === "in process";

			if (isInProcess) {
				userBusyMap.set(userId, false);
			} else {
				if (!userBusyMap.has(userId)) {
					userBusyMap.set(userId, true);
				}
			}
		}
	}

	return userBusyMap;
};

const recalculateTaskTime = (task: any) => {
	let totalMinutes = 0;

	for (const record of task.timeSpentRecords) {
		totalMinutes += record.hours * 60;
		totalMinutes += record.minutes;
	}

	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	task.timeSpentTotal = `${hours}h ${minutes}m`;
};

const isAdmin = (req: any) => req.user?.role === "admin";

/* =========================
   GET ALL PROJECTS
========================= */

const getAllProjects: RequestHandler = async (req, res, next) => {
	try {
		const projects = await Project.find()
			.populate("projectMembers", "firstname lastname")
			.populate("createdBy", "firstname lastname")
			.populate("tasks.taskMember", "firstname lastname");

		res.status(200).json(projects);
	} catch (error) {
		next(error);
	}
};

/* =========================
   GET MY PROJECTS
========================= */

const getMyProjects: RequestHandler = async (req: any, res, next) => {
	try {
		const userId = req.user.userId;

		const projects = await Project.find({
			"tasks.taskMember": userId,
		})
			.populate("projectMembers", "firstname lastname")
			.populate("createdBy", "firstname lastname")
			.populate("tasks.taskMember", "firstname lastname");

		res.status(200).json(projects);
	} catch (error) {
		next(error);
	}
};

/* =========================
   GET PROJECT BY ID
========================= */

const getProjectById: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;

		const project = await Project.findById(id)
			.populate("createdBy", "firstname lastname")
			.populate("projectMembers", "firstname lastname")
			.populate("tasks.taskMember", "firstname lastname")
			.populate("comments.author", "firstname lastname");

		if (!project) {
			return next(new AppError("Project not found", 404));
		}

		res.status(200).json(project);
	} catch (error) {
		next(error);
	}
};

/* =========================
   CREATE PROJECT
========================= */

const createProject: RequestHandler = async (req, res, next) => {
	try {
		const validation = ProjectCreateCheckSchema.safeParse(req.body);

		if (!validation.success) {
			return next(
				new AppError(JSON.stringify(validation.error.flatten()), 400),
			);
		}

		const data = validation.data;

		const startDate = safeDate(data.startDate);
		const endDate = safeDate(data.endDate);

		const projectMembers = extractMembersFromTasks(data.tasks);

		const project = await Project.create({
			...data,
			startDate,
			endDate,
			projectMembers,
			createdBy: (req as any).user.userId,
		});

		const allProjects = await Project.find();
		const availabilityMap = calculateUserAvailability(allProjects);

		for (const [userId, available] of availabilityMap.entries()) {
			await User.findByIdAndUpdate(userId, { available });
		}

		res.status(201).json(project);
	} catch (error) {
		next(error);
	}
};

/* =========================
   UPDATE PROJECT
========================= */

const updateProject: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		if ("startDate" in updates) {
			updates.startDate = safeDate(updates.startDate);
		}

		if ("endDate" in updates) {
			updates.endDate = safeDate(updates.endDate);
		}

		if (updates.tasks) {
			updates.projectMembers = extractMembersFromTasks(updates.tasks);
		}

		const updated = await Project.findByIdAndUpdate(
			id,
			{ $set: updates },
			{ new: true, runValidators: true },
		);

		if (!updated) {
			return next(new AppError("Project not found", 404));
		}

		const allProjects = await Project.find();
		const availabilityMap = calculateUserAvailability(allProjects);

		for (const [userId, available] of availabilityMap.entries()) {
			await User.findByIdAndUpdate(userId, { available });
		}

		res.status(200).json(updated);
	} catch (error) {
		next(error);
	}
};

/* =========================
   DELETE PROJECT
========================= */

const deleteProject: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;

		const deleted = await Project.findByIdAndDelete(id);

		if (!deleted) {
			return next(new AppError("Project not found", 404));
		}

		res.status(200).json({ message: "Project deleted" });
	} catch (error) {
		next(error);
	}
};

/* =========================================================
   TIME TRACKING
========================================================= */

const addTimeRecord: RequestHandler = async (req: any, res, next) => {
	try {
		const { projectId, taskId } = req.params;
		const { date, hours, minutes } = req.body;

		const project = await Project.findById(projectId);
		if (!project) return next(new AppError("Project not found", 404));

		const task = project.tasks.id(taskId);
		if (!task) return next(new AppError("Task not found", 404));

		if (!isAdmin(req) && task.taskMember?.toString() !== req.user.userId) {
			return next(new AppError("Not allowed", 403));
		}

		const currentUser = await User.findById(req.user.userId);

		if (!currentUser) {
			return next(new AppError("User not found", 404));
		}

		task.timeSpentRecords.push({
			user: currentUser._id,
			firstname: currentUser.firstname,
			lastname: currentUser.lastname,
			date,
			hours,
			minutes,
		});

		recalculateTaskTime(task);

		await project.save();

		res.json(project);
	} catch (err) {
		next(err);
	}
};

const updateTimeRecord: RequestHandler = async (req: any, res, next) => {
	try {
		const { projectId, taskId, recordId } = req.params;
		const { date, hours, minutes } = req.body;

		const project = await Project.findById(projectId);
		if (!project) return next(new AppError("Project not found", 404));

		const task = project.tasks.id(taskId);
		if (!task) return next(new AppError("Task not found", 404));
		const record = task?.timeSpentRecords.id(recordId);

		if (!record) return next(new AppError("Record not found", 404));

		if (!isAdmin(req) && record.user.toString() !== req.user.userId) {
			return next(new AppError("Not allowed", 403));
		}

		if (date) record.date = date;
		if (hours !== undefined) record.hours = hours;
		if (minutes !== undefined) record.minutes = minutes;

		recalculateTaskTime(task);

		await project.save();

		res.json(project);
	} catch (err) {
		next(err);
	}
};

const deleteTimeRecord: RequestHandler = async (req: any, res, next) => {
	try {
		const { projectId, taskId, recordId } = req.params;

		const project = await Project.findById(projectId);
		if (!project) return next(new AppError("Project not found", 404));

		const task = project.tasks.id(taskId);
		if (!task) return next(new AppError("Task not found", 404));
		const record = task?.timeSpentRecords.id(recordId);

		if (!record) return next(new AppError("Record not found", 404));

		if (!isAdmin(req) && record.user.toString() !== req.user.userId) {
			return next(new AppError("Not allowed", 403));
		}

		record.deleteOne();

		recalculateTaskTime(task);

		await project.save();

		res.json(project);
	} catch (err) {
		next(err);
	}
};

/* =========================================================
   COMMENTS
========================================================= */

const addComment: RequestHandler = async (req: any, res, next) => {
	try {
		const { projectId } = req.params;
		const { title, comment } = req.body;

		const project = await Project.findById(projectId);
		if (!project) return next(new AppError("Project not found", 404));

		project.comments.push({
			title,
			comment,
			author: req.user.userId,
			firstname: req.user.firstname,
			lastname: req.user.lastname,
			timestamp: new Date(),
		});

		await project.save();

		res.json(project);
	} catch (err) {
		next(err);
	}
};

const updateComment: RequestHandler = async (req: any, res, next) => {
	try {
		const { projectId, commentId } = req.params;
		const { title, comment } = req.body;

		const project = await Project.findById(projectId);
		if (!project) return next(new AppError("Project not found", 404));

		const c = project.comments.id(commentId);
		if (!c) return next(new AppError("Comment not found", 404));

		if (!isAdmin(req) && c.author.toString() !== req.user.userId) {
			return next(new AppError("Not allowed", 403));
		}

		if (title) c.title = title;
		if (comment) c.comment = comment;

		await project.save();

		res.json(project);
	} catch (err) {
		next(err);
	}
};

const deleteComment: RequestHandler = async (req: any, res, next) => {
	try {
		const { projectId, commentId } = req.params;

		const project = await Project.findById(projectId);
		if (!project) return next(new AppError("Project not found", 404));

		const c = project.comments.id(commentId);
		if (!c) return next(new AppError("Comment not found", 404));

		if (!isAdmin(req) && c.author.toString() !== req.user.userId) {
			return next(new AppError("Not allowed", 403));
		}

		c.deleteOne();
		await project.save();

		res.json(project);
	} catch (err) {
		next(err);
	}
};

export {
	getAllProjects,
	getMyProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
	addTimeRecord,
	updateTimeRecord,
	deleteTimeRecord,
	addComment,
	updateComment,
	deleteComment,
};
