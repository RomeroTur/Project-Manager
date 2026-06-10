import { z } from "zod";

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8, "At least 8 chars"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
