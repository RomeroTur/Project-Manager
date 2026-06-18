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

/* new routes for comments and time tracking */

projectRouter.post(
	"/:projectId/tasks/:taskId/time",
	authMiddleware,
	addTimeRecord,
);

projectRouter.patch(
	"/:projectId/tasks/:taskId/time/:recordId",
	authMiddleware,
	updateTimeRecord,
);

projectRouter.delete(
	"/:projectId/tasks/:taskId/time/:recordId",
	authMiddleware,
	deleteTimeRecord,
);

projectRouter.post("/:projectId/comments", authMiddleware, addComment);

projectRouter.patch(
	"/:projectId/comments/:commentId",
	authMiddleware,
	updateComment,
);

projectRouter.delete(
	"/:projectId/comments/:commentId",
	authMiddleware,
	deleteComment,
);

export { projectRouter };
