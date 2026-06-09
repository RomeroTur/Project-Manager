import express from "express";
import { Router } from "express";
import {
	getAllUsers,
	getUserById,
	logoutUser,
	loginUser,
	registerUser,
} from "#controllers";

const userRouter = Router();

userRouter.use(express.json());

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

export { userRouter };
