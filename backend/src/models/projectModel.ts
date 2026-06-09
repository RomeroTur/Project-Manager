import { Schema, model } from "mongoose";
import { z } from "zod";

const ProjectSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},
	],
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: false,
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

const ProjectCreateCheckSchema = z.object({});

export { ProjectSchema, Project };
