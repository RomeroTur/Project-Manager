import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserRegisterCheckSchema } from "#models";
import { z } from "zod";

const logout: RequestHandler = async (req, res, next) => {
	res.clearCookie("token");
	res.json({ msg: "Logged out" });
};

const login: RequestHandler = async (req, res, next) => {
	try {
		const { password, email } = req.body;

		const user = await User.findOne({ email }).lean();

		if (!user) {
			const err = new Error("No User with such E-Mail");
			(err as any).status = 400;
			throw err;
		}

		const match = await bcrypt.compare(
			password,
			user!.passwordHash as string,
		);

		let token;
		if (!match) {
			const err = new Error("Invalid password");
			(err as any).status = 400;
			throw err;
		} else {
			token = jwt.sign(
				{ _id: user._id },
				process.env.TOKEN_MIX as string,
			);
		}

		res.cookie("token", token, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
		});

		res.json({ msg: "Login | Success", token });
	} catch (err) {
		next(err);
	}
};

const register: RequestHandler = async (req, res, next) => {
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
			username: data.username,
			email: data.email,
			passwordHash: hashedPW,
		});

		res.json({ msg: "Register | Success:", user: { ...user } });
	} catch (err) {
		next(err);
	}
};

export { logout, login, register };
