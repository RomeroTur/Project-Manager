import express from "express";
import { Router } from "express";
import {
	getAllProjects,
	getMyProjects,
	getProjectById,
	deleteProject,
	createProject,
	updateProject,
} from "#controllers";
import { authMiddleware } from "#middleware";

const projectRouter = Router();

projectRouter.use(express.json());

projectRouter.get("/", getAllProjects);
projectRouter.get("/my-projects", authMiddleware, getMyProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.post("/create", authMiddleware, createProject);
projectRouter.delete("/:id", deleteProject);
projectRouter.patch("/:id", updateProject);

export { projectRouter };
