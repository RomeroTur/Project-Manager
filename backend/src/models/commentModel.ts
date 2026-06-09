import { Schema, model } from "mongoose";

const CommentSchema = new Schema({
	taskId: {
		type: Schema.Types.ObjectId,
		ref: "Task",
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	commentText: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Comment = model("Comment", CommentSchema, "comments");

export { CommentSchema, Comment };
