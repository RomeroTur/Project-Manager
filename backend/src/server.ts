import express from "express";

import { connectDB } from "#db";
import { authRouter, projectRouter } from "#routes";

const server = express();

server.use("/auth/", authRouter);
server.use("/project/", projectRouter);

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		await connectDB();

		server.listen(PORT, () => {
			console.log(`Server running on ${PORT}`);
		});
	} catch (err) {
		console.error("DB connection failed:", err);
		process.exit(1);
	}
}

start();
