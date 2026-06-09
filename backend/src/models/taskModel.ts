import { Schema, model } from "mongoose";

const TaskSchema = new Schema({
	title: String,
	description: String,
	projectId: {
		type: Schema.Types.ObjectId,
		ref: "Project",
	},
	assignedTo: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	status: String,
	priority: String,
	timeSpent: String,
	startdate: {
		type: Date,
		required: false,
	},
	enddate: {
		type: Date,
		required: false,
	},
});

const Task = model("Task", TaskSchema, "tasks");

export { TaskSchema, Task };
