import { Request, Response, NextFunction } from "express";
import { AppError } from "#utils";

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// known operational errors
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			message: err.message,
		});
	}

	// mongoose / unexpected / programming errors
	return res.status(500).json({
		message: "Internal server error",
	});
};
