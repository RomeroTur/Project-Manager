import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserRegisterCheckSchema } from "#models";
import { z } from "zod";

const getCurrentUser: RequestHandler = async (req: any, res) => {
	const user = await User.findById(req.user.userId).select("-password");

	if (!user) {
		return res.status(404).json({
			message: "User not found",
		});
	}

	res.json(user);
};

const getAllUsers: RequestHandler = async (req, res) => {
	try {
		const users = await User.find().select("-password");
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({
			message: "Failed to get users",
			error,
		});
	}
};

const getUserById: RequestHandler = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select("-password");

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({
			message: "Failed to get user",
			err,
		});
	}
};

const updateUser: RequestHandler = async (req, res) => {
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
			return res.status(404).json({
				message: "User not found",
			});
		}

		res.status(200).json(updated);
	} catch (error) {
		res.status(500).json({
			message: "Failed to update user",
			error,
		});
	}
};

const deleteUser: RequestHandler = async (req, res) => {
	try {
		const deleted = await User.findByIdAndDelete(req.params.id);

		if (!deleted) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		res.status(200).json({
			message: "User deleted",
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to delete user",
			error,
		});
	}
};

const loginUser: RequestHandler = async (req, res) => {
	try {
		const { password, email } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				message: "Invalid credentials",
			});
		}

		const match = await bcrypt.compare(password, user.password as string);

		if (!match) {
			return res.status(400).json({
				message: "Invalid credentials",
			});
		}

		const token = jwt.sign(
			{
				userId: user._id,
				role: user.role,
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
		res.status(500).json({
			message: "Login failed",
		});
	}
};

const logoutUser: RequestHandler = async (req, res) => {
	res.clearCookie("token", {
		httpOnly: true,
		sameSite: "lax",
	});

	res.json({
		message: "Logged out successfully",
	});
};

const registerUser: RequestHandler = async (req, res, next) => {
	try {
		const { data, success, error } = UserRegisterCheckSchema.safeParse(
			req.body,
		);

		if (!success) {
			return res.status(400).json({
				message: z.prettifyError(error),
			});
		}

		const exists = await User.exists({
			email: data.email,
		});

		if (exists) {
			return res.status(400).json({
				message: "Email already exists",
			});
		}

		const salt = await bcrypt.genSalt(13);
		const hashed = await bcrypt.hash(data.password, salt);

		const user = await User.create({
			...data,
			password: hashed,
		});

		res.status(201).json({
			message: "User created",
			user,
		});
	} catch (err) {
		next(err);
	}
};

export {
	getCurrentUser,
	getAllUsers,
	getUserById,
	updateUser,
	logoutUser,
	deleteUser,
	loginUser,
	registerUser,
};
