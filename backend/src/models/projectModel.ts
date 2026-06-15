import { Schema, model } from "mongoose";
import { z } from "zod";

/* =========================
   TIME RECORD
========================= */

const TimeSpentRecordSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		date: {
			type: Date,
			required: true,
		},

		hours: {
			type: Number,
			required: true,
			default: 0,
		},

		minutes: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{
		_id: false,
	},
);

/* =========================
   TASK
========================= */

const TaskSchema = new Schema(
	{
		taskTitle: {
			type: String,
			required: true,
		},

		taskMember: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},

		taskStatus: {
			type: String,
			enum: ["in process", "on hold", "cancelled", "completed"],
			default: "on hold",
		},

		timeSpentTotal: {
			type: String,
			default: "0h 0m",
		},

		timeSpentRecords: [TimeSpentRecordSchema],
	},
	{
		_id: true,
	},
);

/* =========================
   COMMENT
========================= */

const CommentSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},

		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		timestamp: {
			type: Date,
			default: Date.now,
		},

		comment: {
			type: String,
			required: true,
		},
	},
	{
		_id: true,
	},
);

/* =========================
   PROJECT
========================= */

const ProjectSchema = new Schema(
	{
		projectTitle: {
			type: String,
			required: true,
		},

		projectDescription: {
			type: String,
			default: "",
		},

		projectStatus: {
			type: String,
			enum: ["in process", "on hold", "cancelled", "completed"],
			default: "on hold",
		},

		projectMembers: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],

		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		startDate: {
			type: Date,
		},

		endDate: {
			type: Date,
		},

		tasks: [TaskSchema],

		comments: [CommentSchema],
	},
	{
		timestamps: true,
	},
);

const Project = model("Project", ProjectSchema, "projects");

/* =========================
   ZOD
========================= */

const ProjectCreateCheckSchema = z.object({
	projectTitle: z
		.string()
		.min(3, "Project title must contain at least 3 characters"),

	projectDescription: z.string().optional(),

	// default: on hold?

	projectStatus: z
		.enum(["in process", "on hold", "cancelled", "completed"])
		.optional(),

	projectMembers: z.array(z.string()).optional(),

	createdBy: z.string(),

	startDate: z.coerce.date().optional(),

	endDate: z.coerce.date().optional(),

	tasks: z
		.array(
			z.object({
				taskTitle: z.string().min(1),

				taskMember: z.string().optional(),

				taskStatus: z
					.enum(["in process", "on hold", "cancelled", "completed"])
					.optional(),
			}),
		)
		.optional(),

	comments: z
		.array(
			z.object({
				title: z.string(),

				author: z.string(),

				comment: z.string(),
			}),
		)
		.optional(),
});

export { Project, ProjectSchema, ProjectCreateCheckSchema };
