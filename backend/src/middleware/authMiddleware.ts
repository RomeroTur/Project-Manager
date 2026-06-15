import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "#utils";

interface JwtPayload {
	userId: string;
	role: string;
	email: string;
}

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.cookies?.token;

		if (!token) {
			return next(new AppError("No token provided", 401));
		}

		const decoded = jwt.verify(
			token,
			process.env.TOKEN_MIX as string,
		) as JwtPayload;

		(req as any).user = decoded;

		next();
	} catch {
		next(new AppError("Invalid or expired token", 401));
	}
};
