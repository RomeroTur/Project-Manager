export type UserPersonal = {
	birthday?: string;
	tel?: string;
	address?: string;
	description?: string;
};

export type AssignedTask = {
	projectTitle: string;
	taskTitle: string;
	taskStatus: string;
};

export type User = {
	_id: string;
	firstname: string;
	lastname: string;
	email: string;
	role: "admin" | "user";
	available: boolean;
	skills: string[];
	personal: UserPersonal;
	assignedTasks?: AssignedTask[];
};
