import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
			return res.status(401).json({
				message: "No token provided",
			});
		}

		const decoded = jwt.verify(
			token,
			process.env.TOKEN_MIX as string,
		) as JwtPayload;

		// attach user to request
		(req as any).user = decoded;

		next();
	} catch (err) {
		return res.status(401).json({
			message: "Invalid or expired token",
		});
	}
};
