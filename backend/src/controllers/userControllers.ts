import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserRegisterCheckSchema } from "#models";
import { z } from "zod";

type UserType = {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	role: string;
};

const getAllUsers: RequestHandler = async (req, res) => {
	try {
		const users: UserType[] = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({ message: "Failed to get Users", error });
	}
};

const getUserById: RequestHandler = async (req, res) => {
	const { id } = req.params;
	try {
		const searchedUser = await User.findById(id);
		res.status(200).json(searchedUser);
	} catch (err) {
		res.status(404).json({ message: "Failed to get User", err });
	}
};

const logoutUser: RequestHandler = async (req, res, next) => {
	res.clearCookie("token");
	res.json({ msg: "Logged out" });
};

const loginUser: RequestHandler = async (req, res, next) => {
	try {
		const { password, email } = req.body;

		const user = await User.findOne({ email }).lean();

		if (!user) {
			const err = new Error("No User with such E-Mail");
			(err as any).status = 400;
			throw err;
		}

		const match = await bcrypt.compare(password, user!.password as string);

		let token;
		if (!match) {
			const err = new Error("Invalid password");
			(err as any).status = 400;
			throw err;
		} else {
			token = jwt.sign(
				{
					_id: user._id,
					role: user.role,
					email: user.email,
				},
				process.env.TOKEN_MIX as string,
				{
					expiresIn: "1d",
				},
			);
		}

		res.cookie("token", token, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
		});

		res.json({
			msg: "Login | Success",
			token,
			user: {
				_id: user._id,
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.email,
				role: user.role,
			},
		});
	} catch (err) {
		console.log("err: ", err);

		return res.status(500).json({
			message: "Login failed",
		});
	}
};

const registerUser: RequestHandler = async (req, res, next) => {
	try {
		const { data, success, error } = UserRegisterCheckSchema.safeParse(
			req.body,
		);

		if (!success) {
			const err = new Error(z.prettifyError(error));
			(err as any).status = 400;
			throw err;
		}

		const emailExists = await User.exists({ email: data.email });
		if (emailExists)
			throw new Error("User with this E-Mail already exists");

		const salt = await bcrypt.genSalt(13);
		const hashedPW = await bcrypt.hash(data.password, salt);

		const user = await User.create({
			firstname: data.firstname,
			lastname: data.lastname,
			email: data.email,
			password: hashedPW,
			role: data.role,
		});

		res.json({ msg: "Register | Success:", user: { ...user } });
	} catch (err) {
		next(err);
	}
};

export { getAllUsers, getUserById, logoutUser, loginUser, registerUser };
