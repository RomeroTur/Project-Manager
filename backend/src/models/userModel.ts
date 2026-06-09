import { Schema, model } from "mongoose";
import { z } from "zod";

const UserSchema = new Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: String,
	role: {
		type: String,
		required: true,
	},
});

const User = model("User", UserSchema, "users");

const UserRegisterCheckSchema = z.object({
	firstname: z.string({ error: "First name is required" }),
	lastname: z.string({ error: "Last name is required" }),
	email: z.string().email({ error: "A correct E-Mail is required" }),
	password: z
		.string({
			error: "A password is required",
		})
		.min(8, "Password must contain at least 8 characters")
		.regex(/[A-Za-z]/, "Password must contain letters")
		.regex(/[0-9]/, "Password must contain numbers"),
	role: z.string({ error: "Role is required" }),
});

export { UserSchema, User, UserRegisterCheckSchema };
