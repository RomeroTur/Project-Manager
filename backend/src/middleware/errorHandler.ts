import { Request, Response, NextFunction } from "express";

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	console.error("ERROR:", err);

	res.status(err.statusCode || err.status || 500).json({
		message: err.message || "Internal server error",
		stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
	});
};
