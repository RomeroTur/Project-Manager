import { Schema, model } from "mongoose";

const ProjectSchema = new Schema({
	title: String,
	description: String,
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	startdate: {
		type: Date,
		required: false,
	},
	enddate: {
		type: Date,
		required: false,
	},
});

const Project = model("Project", ProjectSchema, "projects");

export { ProjectSchema, Project };
