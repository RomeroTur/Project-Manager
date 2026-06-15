export type DashboardProject = {
	_id: string;
	projectTitle: string;
	projectStatus: "in process" | "on hold" | "cancelled" | "completed";
	startDate?: string;
	endDate?: string;

	projectMembers?: {
		_id: string;
		firstname: string;
		lastname: string;
	}[];
};
