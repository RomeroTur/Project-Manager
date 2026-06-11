import express from "express";
import { Router } from "express";
import {
	getCurrentUser,
	getAllUsers,
	getUserById,
	logoutUser,
	loginUser,
	registerUser,
} from "#controllers";
import { authMiddleware } from "#middleware";

const userRouter = Router();

userRouter.use(express.json());

userRouter.get("/", getAllUsers);
userRouter.get("/me", authMiddleware, getCurrentUser);
userRouter.get("/:id", getUserById);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

export { userRouter };
