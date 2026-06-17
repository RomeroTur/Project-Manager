import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserRegisterCheckSchema } from "#models";
import { z } from "zod";
import { AppError } from "#utils";

import { Project } from "#models";

/* -----------------------------
   GET CURRENT USER
------------------------------*/
export const getCurrentUser: RequestHandler = async (req: any, res, next) => {
	try {
		const user = await User.findById(req.user.userId).select("-password");

		if (!user) {
			return next(new AppError("User not found", 404));
		}

		res.json(user);
	} catch (err) {
		next(err);
	}
};

/* -----------------------------
   GET ALL USERS
------------------------------*/
export const getAllUsers: RequestHandler = async (req, res, next) => {
	try {
		const users = await User.find().select("-password");
		res.status(200).json(users);
	} catch (err) {
		next(new AppError("Failed to get users", 500));
	}
};

/* -----------------------------
   GET USER BY ID
------------------------------*/
export const getUserById: RequestHandler = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id).select("-password");

		if (!user) {
			return next(new AppError("User not found", 404));
		}

		const projects = await Project.find({
			"tasks.taskMember": user._id,
		});

		const assignedTasks = projects.flatMap((project) =>
			project.tasks
				.filter(
					(task) =>
						task.taskMember?.toString() === user._id.toString(),
				)
				.map((task) => ({
					projectId: project._id,
					projectTitle: project.projectTitle,
					taskTitle: task.taskTitle,
					taskStatus: task.taskStatus,
					timeSpentTotal: task.timeSpentTotal,
				})),
		);

		res.status(200).json({
			...user.toObject(),
			assignedTasks,
		});
	} catch (err) {
		next(new AppError("Failed to get user", 500));
	}
};

/* -----------------------------
   UPDATE USER
------------------------------*/
export const updateUser: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		if (updates.password) {
			const salt = await bcrypt.genSalt(13);
			updates.password = await bcrypt.hash(updates.password, salt);
		}

		const updated = await User.findByIdAndUpdate(
			id,
			{ $set: updates },
			{ new: true, runValidators: true },
		).select("-password");

		if (!updated) {
			return next(new AppError("User not found", 404));
		}

		res.status(200).json(updated);
	} catch (err) {
		next(new AppError("Failed to update user", 500));
	}
};

/* -----------------------------
   DELETE USER
------------------------------*/
export const deleteUser: RequestHandler = async (req, res, next) => {
	try {
		const deleted = await User.findByIdAndDelete(req.params.id);

		if (!deleted) {
			return next(new AppError("User not found", 404));
		}

		res.status(200).json({ message: "User deleted" });
	} catch (err) {
		next(new AppError("Failed to delete user", 500));
	}
};

/* -----------------------------
   LOGIN
------------------------------*/
export const loginUser: RequestHandler = async (req, res, next) => {
	try {
		const { password, email } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return next(new AppError("Invalid credentials", 400));
		}

		const match = await bcrypt.compare(password, user.password);

		if (!match) {
			return next(new AppError("Invalid credentials", 400));
		}

		const token = jwt.sign(
			{
				userId: user._id,
				role: user.role,
				email: user.email,
			},
			process.env.TOKEN_MIX as string,
		);

		res.cookie("token", token, {
			httpOnly: true,
			sameSite: "lax",
		});

		res.json({
			message: "Login successful",
			user: {
				_id: user._id,
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.email,
				role: user.role,
			},
		});
	} catch (err) {
		next(new AppError("Login failed", 500));
	}
};

/* -----------------------------
   LOGOUT
------------------------------*/
export const logoutUser: RequestHandler = async (req, res) => {
	res.clearCookie("token", {
		httpOnly: true,
		sameSite: "lax",
	});

	res.json({
		message: "Logged out successfully",
	});
};

/* -----------------------------
   REGISTER
------------------------------*/
export const registerUser: RequestHandler = async (req, res, next) => {
	try {
		const { data, success, error } = UserRegisterCheckSchema.safeParse(
			req.body,
		);

		if (!success) {
			return next(new AppError(z.prettifyError(error), 400));
		}

		const exists = await User.exists({ email: data.email });

		if (exists) {
			return next(new AppError("Email already exists", 400));
		}

		const salt = await bcrypt.genSalt(13);
		const hashed = await bcrypt.hash(data.password, salt);

		const user = await User.create({
			...data,
			password: hashed,
			available: true,
		});

		const safeUser = await User.findById(user._id).select("-password");

		res.status(201).json({
			message: "User created",
			user: safeUser,
		});
	} catch (err) {
		next(err);
	}
};
