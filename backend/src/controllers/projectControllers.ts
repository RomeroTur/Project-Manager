import { Types } from "mongoose";
import { Project } from "#models";
import { RequestHandler } from "express";

type ProjectType = {
	title: string;
	description?: string;
	members?: Types.ObjectId[];
	createdBy?: Types.ObjectId;
	startdate?: Date;
	enddate?: Date;
};

const getAllProjects: RequestHandler = async (req, res) => {
	try {
		const projects: ProjectType[] = await Project.find();
		res.status(200).json(projects);
	} catch (error) {
		res.status(404).json({ message: "Failed to get projects", error });
	}
};

const createProject: RequestHandler = async (req, res) => {
	try {
		const project = new Project(req.body);
		const saved = await project.save();
		res.status(201).json(saved);
	} catch (error) {
		res.status(500).json({ message: "Failed to create project", error });
	}
};

const deleteProject: RequestHandler = async (req, res) => {
	try {
		const { id } = req.body;
		const deleted = await Project.findByIdAndDelete(id);
		if (!deleted) {
			res.status(404).json({ message: `Project not found: ${id}` });
			return;
		}
		res.status(200).json(deleted);
	} catch (error) {
		res.status(500).json({ message: "Failed to delete project", error });
	}
};

const updateProject: RequestHandler = async (req, res) => {
	try {
		const { id, ...updates } = req.body;
		const updated = await Project.findByIdAndUpdate(
			id,
			{ $set: updates },
			{ new: true, runValidators: true },
		);
		if (!updated) {
			res.status(404).json({ message: `Project not found: ${id}` });
			return;
		}
		res.status(200).json(updated);
	} catch (error) {
		res.status(500).json({ message: "Failed to update project", error });
	}
};

export { getAllProjects, createProject, deleteProject, updateProject };
