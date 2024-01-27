import { NextFunction, Request, Response } from "express";
import prisma from "../config/db.config";
import { sign, verify } from "jsonwebtoken";

const secret: string = "shadab123";

export const verifyToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { authorization } = req.headers;

		// Cut the received string and takes the token at position 1.
		const token = (authorization && authorization.split(" ")[1]) || "";
		if (!token) {
			return res.status(401).json({
				status: false,
				errors: [
					{
						message: "You need to sign in to proceed.",
						code: "NOT_SIGNEDIN",
					},
				],
			});
		}

		const payload: any = verify(token, secret);
		if (!payload)
			return res.status(401).json({
				message: "UnAuthorized user credentials",
			});

		const user = await prisma.user.findFirst({
			where: {
				id: payload.id,
			},
		});

		if (!user)
			return res.status(401).json({
				message: "UnAuthorized user credentials",
			});
		const { password, ...loggedUser } = user;
		res.locals.user = loggedUser;

		next();
	} catch (error: any) {
		console.error(error);
		return res.status(500).send("Internal Server Error");
	}
};
