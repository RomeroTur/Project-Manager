import express from "express";
import { Router } from "express";
import {
	getAllProjects,
	deleteProject,
	createProject,
	updateProject,
} from "#controllers";

const projectRouter = Router();

projectRouter.use(express.json());

projectRouter.get("/", getAllProjects);
projectRouter.post("/", createProject);
projectRouter.delete("/:id", deleteProject);
projectRouter.put("/:id", updateProject);

export { projectRouter };
