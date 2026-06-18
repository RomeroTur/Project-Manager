import { z } from "zod";

export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.regex(/[A-Za-z]/, "Password must contain letters")
	.regex(/[0-9]/, "Password must contain numbers");
