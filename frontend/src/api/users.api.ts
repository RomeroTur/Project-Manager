import { api } from "./client";
import type { User } from "../types/User";

export const usersApi = {
	getAll: () => api<User[]>("/users"),

	getById: (id: string) => api<User>(`/users/${id}`),

	update: (id: string, data: Partial<User>) =>
		api<User>(`/users/${id}`, {
			method: "PATCH",
			body: JSON.stringify(data),
		}),

	delete: (id: string) =>
		api(`/users/${id}`, {
			method: "DELETE",
		}),
};
