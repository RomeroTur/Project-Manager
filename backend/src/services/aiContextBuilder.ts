/* =========================
	what AI is allowed to see
========================= */

import { Project, User } from "#models";

export const buildAdminContext = async () => {
	const projects = await Project.find()
		.populate("projectMembers", "firstname lastname")
		.populate("tasks.taskMember", "firstname lastname");

	const users = await User.find().select(
		"firstname lastname email role available skills personal.tel personal.address personal.description personal.birthday",
	);

	return {
		role: "admin",
		projects,
		users,
	};
};

export const buildUserContext = async (userId: string) => {
	const projects = await Project.find({
		"tasks.taskMember": userId,
	})
		.populate("projectMembers", "firstname lastname")
		.populate("tasks.taskMember", "firstname lastname");

	const users = await User.find().select(
		"firstname lastname available skills email personal.tel",
	);

	return {
		role: "user",
		userId,
		users,
		projects,
	};
};
