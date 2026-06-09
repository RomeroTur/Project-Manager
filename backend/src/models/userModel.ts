import { Schema, model } from "mongoose";

const UserSchema = new Schema({
	firstname: String,
	lastname: String,
	email: String,
	password: String,
	role: String,
});

const User = model("User", UserSchema, "users");

export { UserSchema, User };
