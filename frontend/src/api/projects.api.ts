import { api } from "./client";
import type { Project } from "../types/Project";

export const projectsApi = {
	getAll: () => api<Project[]>("/projects"),

	getById: (id: string) => api<Project>(`/projects/${id}`),

	create: (data: Partial<Project>) =>
		api<Project>("/projects", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	update: (id: string, data: Partial<Project>) =>
		api<Project>(`/projects/${id}`, {
			method: "PATCH",
			body: JSON.stringify(data),
		}),

	delete: (id: string) =>
		api(`/projects/${id}`, {
			method: "DELETE",
		}),
};
