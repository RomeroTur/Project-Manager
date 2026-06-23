import express from "express";
import { Router } from "express";
import { authMiddleware } from "#middleware";

import {
	getAllProjects,
	getMyProjects,
	getProjectById,
	deleteProject,
	createProject,
	updateProject,
	addTimeRecord,
	updateTimeRecord,
	deleteTimeRecord,
	addComment,
	updateComment,
	deleteComment,
	updateTaskStatus,
} from "#controllers";

const projectRouter = Router();

projectRouter.use(express.json());

/* PROJECTS */
projectRouter.get("/", getAllProjects);
projectRouter.get("/my-projects", authMiddleware, getMyProjects);
projectRouter.get("/:id", getProjectById);

projectRouter.post("/create", authMiddleware, createProject);
projectRouter.patch("/:id", authMiddleware, updateProject);
projectRouter.delete("/:id", authMiddleware, deleteProject);

/* TIME */
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

projectRouter.patch(
	"/:projectId/tasks/:taskId/status",
	authMiddleware,
	updateTaskStatus,
);

/* COMMENTS */
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
