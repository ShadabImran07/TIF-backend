import express from "express";
import { Students } from "../models/Students";

export const isAdminAuthenticated = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	const { email, password } = req.headers;
	if (email === "admin@admin.com" && password === "admin") {
		next();
	} else {
		res.status(401).json({ message: "You are not admin" });
	}
};

export const isStudentAuthenticated = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	const { email, password } = req.headers;
	const student = await Students.findOne({ email, password });
	if (student) {
		res.locals.userid = student._id;
		next();
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
};

// export default { isAdminAuthenticated, isStudentAuthenticated };
