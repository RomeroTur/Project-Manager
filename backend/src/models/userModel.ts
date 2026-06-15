import { Schema, model } from "mongoose";
import { z } from "zod";

/* -----------------------------
   MONGOOSE USER SCHEMA
------------------------------*/
const UserSchema = new Schema(
	{
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
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},

		role: {
			type: String,
			enum: ["admin", "user"],
			required: true,
		},

		available: {
			type: Boolean,
			default: true,
		},

		skills: {
			type: [String],
			default: [],
		},

		personal: {
			birthday: {
				type: Date,
				required: false,
			},
			tel: {
				type: String,
				required: false,
			},
			address: {
				type: String,
				required: false,
			},
			description: {
				type: String,
				required: false,
			},
		},
	},
	{ timestamps: true },
);

const User = model("User", UserSchema, "users");

/* -----------------------------
   ZOD VALIDATION (REGISTER)
   IMPORTANT: mirrors schema loosely
------------------------------*/
const UserRegisterCheckSchema = z.object({
	firstname: z.string().min(1, "First name is required"),
	lastname: z.string().min(1, "Last name is required"),

	email: z.string().email("Valid email is required"),

	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Za-z]/, "Password must contain letters")
		.regex(/[0-9]/, "Password must contain numbers"),

	role: z.enum(["admin", "user"]),

	skills: z.array(z.string()).optional(),

	personal: z
		.object({
			birthday: z.string().optional(),
			tel: z.string().optional(),
			address: z.string().optional(),
			description: z.string().optional(),
		})
		.optional(),
});

export { User, UserRegisterCheckSchema };
