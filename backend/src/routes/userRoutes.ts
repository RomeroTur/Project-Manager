import { Router } from "express";

import {
	getCurrentUser,
	getAllUsers,
	getUserById,
	updateUser,
	logoutUser,
	deleteUser,
	loginUser,
	registerUser,
} from "#controllers";

import { authMiddleware } from "#middleware";

const userRouter = Router();

//userRouter.use(express.json());
userRouter.get("/me", authMiddleware, getCurrentUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);

userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

export { userRouter };
