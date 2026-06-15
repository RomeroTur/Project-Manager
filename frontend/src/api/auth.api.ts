import { api } from "./client";
import type { User } from "../types/User";

export const authApi = {
	login: (email: string, password: string) =>
		api<{ user: User }>("/users/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		}),

	me: () => api<User>("/users/me"),

	logout: () =>
		api("/users/logout", {
			method: "POST",
		}),
};
