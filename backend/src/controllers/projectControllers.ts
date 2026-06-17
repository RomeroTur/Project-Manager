import { RequestHandler } from "express";
import { Project, ProjectCreateCheckSchema } from "#models";
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

			// IMPORTANT: once busy → always busy
			if (isInProcess) {
				userBusyMap.set(userId, false); // NOT available
			} else {
				// only set available if not already marked busy
				if (!userBusyMap.has(userId)) {
					userBusyMap.set(userId, true);
				}
			}
		}
	}

	return userBusyMap;
};

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

		// normalize dates (IMPORTANT FIX)
		const startDate = safeDate(data.startDate);
		const endDate = safeDate(data.endDate);

		// derive members ONLY from tasks
		const projectMembers = extractMembersFromTasks(data.tasks);

		const project = await Project.create({
			...data,
			startDate,
			endDate,
			projectMembers,
			createdBy: (req as any).user.userId,
		});

		// recompute availability for all affected users
		const allProjects = await Project.find();

		const availabilityMap = calculateUserAvailability(allProjects);

		const User = (await import("#models")).User;

		for (const [userId, available] of availabilityMap.entries()) {
			await User.findByIdAndUpdate(userId, {
				available,
			});
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

		// normalize dates if provided
		if ("startDate" in updates) {
			updates.startDate = safeDate(updates.startDate);
		}

		if ("endDate" in updates) {
			updates.endDate = safeDate(updates.endDate);
		}

		// if tasks updated → recalc members
		if (updates.tasks) {
			updates.projectMembers = extractMembersFromTasks(updates.tasks);
		}

		const updated = await Project.findByIdAndUpdate(
			id,
			{ $set: updates },
			{
				new: true,
				runValidators: true,
			},
		);

		if (!updated) {
			return next(new AppError("Project not found", 404));
		}

		const allProjects = await Project.find();
		const availabilityMap = calculateUserAvailability(allProjects);

		const User = (await import("#models")).User;

		for (const [userId, available] of availabilityMap.entries()) {
			await User.findByIdAndUpdate(userId, {
				available,
			});
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

		res.status(200).json({
			message: "Project deleted",
		});
	} catch (error) {
		next(error);
	}
};

export {
	getAllProjects,
	getMyProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
};
