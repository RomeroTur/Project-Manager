import express from "express";

import { connectDB } from "#db";

const app = express();

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		await connectDB();

		app.listen(PORT, () => {
			console.log(`Server running on ${PORT}`);
		});
	} catch (err) {
		console.error("DB connection failed:", err);
		process.exit(1);
	}
}

start();
