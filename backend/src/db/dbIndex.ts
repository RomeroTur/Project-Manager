import mongoose from "mongoose";

export async function connectDB() {
	const DB_URL = process.env.DB_URL;

	await mongoose.connect(DB_URL!);

	console.log("Connected DB:", mongoose.connection.name);
}
