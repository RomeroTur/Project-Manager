export type ProjectStatus =
	| "in process"
	| "on hold"
	| "cancelled"
	| "completed";

export type Task = {
	_id?: string;
	taskTitle: string;
	taskMember?: string;
	taskStatus: ProjectStatus;
	timeSpentTotal?: string;
	timeSpentRecords?: {
		user: string;
		date: string;
		hours: number;
		minutes: number;
	}[];
};

export type ProjectComment = {
	_id?: string;
	title: string;
	author: string;
	timestamp?: string;
	comment: string;
};

export type Project = {
	_id: string;
	projectTitle: string;
	projectDescription?: string;
	projectStatus: ProjectStatus;
	projectMembers: string[];
	createdBy: string;
	startDate?: string;
	endDate?: string;
	tasks: Task[];
	comments: ProjectComment[];
};
