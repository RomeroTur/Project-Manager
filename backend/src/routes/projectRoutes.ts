import express from "express";
import { Router } from "express";
import {
	getAllProjects,
	getProjectById,
	deleteProject,
	createProject,
	updateProject,
} from "#controllers";
import { authMiddleware } from "#middleware";

const projectRouter = Router();

projectRouter.use(express.json());

projectRouter.get("/", getAllProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.post("/create", authMiddleware, createProject);
projectRouter.delete("/:id", deleteProject);
projectRouter.put("/:id", updateProject);

export { projectRouter };
