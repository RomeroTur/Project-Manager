import { RequestHandler } from "express";

import { Project, ProjectCreateCheckSchema } from "#models";

import { AppError } from "#utils";

const getAllProjects: RequestHandler = async (req, res, next) => {
	try {
		const projects = await Project.find()
			.populate("projectMembers", "firstname lastname")
			.populate("createdBy", "firstname lastname");

		res.status(200).json(projects);
	} catch (error) {
		next(error);
	}
};

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

const createProject: RequestHandler = async (req, res, next) => {
	try {
		const validation = ProjectCreateCheckSchema.safeParse(req.body);

		if (!validation.success) {
			return next(
				new AppError(JSON.stringify(validation.error.flatten()), 400),
			);
		}

		const project = await Project.create({
			...validation.data,
			createdBy: (req as any).user.userId,
		});

		res.status(201).json(project);
	} catch (error) {
		next(error);
	}
};

const updateProject: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;

		const updated = await Project.findByIdAndUpdate(
			id,
			{
				$set: req.body,
			},
			{
				new: true,
				runValidators: true,
			},
		);

		if (!updated) {
			return next(new AppError("Project not found", 404));
		}

		res.status(200).json(updated);
	} catch (error) {
		next(error);
	}
};

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
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
};
