import { z } from "zod";
import { passwordSchema } from "./passwordSchema";

export const UserRegisterCheckSchema = z.object({
	firstname: z.string().min(1, "First name is required"),
	lastname: z.string().min(1, "Last name is required"),
	email: z.string().email("Valid email is required"),
	password: passwordSchema,

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
