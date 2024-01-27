import express from "express";
import prisma from "../../config/db.config";
import { Snowflake } from "@theinternetfolks/snowflake";
import bcrypt, { compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { z } from "zod";
const secret: string = "shadab123";

const createUserValidator = z.object({
	name: z
		.string({
			required_error: "Name is required",
			invalid_type_error: "Name must be a string",
		})
		.min(2, { message: "Must be 2 or more characters long" }),
	email: z
		.string({
			required_error: "email is required",
			invalid_type_error: "email must be a string",
		})
		.email({ message: "Invalid email address" }),
	password: z
		.string({
			required_error: "password is required",
			invalid_type_error: "password must be a string",
		})
		.min(6, { message: "Must be 6 or more characters long" }),
});
const loginUserValidator = z.object({
	email: z
		.string({
			required_error: "email is required",
			invalid_type_error: "email must be a string",
		})
		.email({ message: "Invalid email address" }),
	password: z
		.string({
			required_error: "password is required",
			invalid_type_error: "password must be a string",
		})
		.min(6, { message: "Must be 6 or more characters long" }),
});

const createUser = async (req: express.Request, res: express.Response) => {
	try {
		const result = createUserValidator.safeParse(req.body);
		if (!result.success) {
			return res.status(403).json({
				status: false,
				errors: {
					message: result.error.issues[0].message,
					code: "INVALID_INPUT",
				},
			});
		}
		const { name, password, email } = req.body;
		const userExists = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		if (userExists) {
			return res.status(422).json({
				status: false,
				errors: { message: "User already exists", code: "RESOURCE_EXISTS" },
			});
		}
		const hashPassword = await bcrypt.hash(password, 10);
		const response = await prisma.user.create({
			data: {
				id: Snowflake.generate(),
				name: name,
				email: email,
				password: hashPassword,
			},
		});
		return res.status(201).json({
			status: true,
			content: {
				data: {
					id: response.id,
					name: response.name,
					email: response.email,
					created_at: response.created_at,
				},
			},
		});
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const loginUser = async (req: express.Request, res: express.Response) => {
	try {
		const result = loginUserValidator.safeParse(req.body);
		if (!result.success) {
			return res.status(403).json({
				status: false,
				errors: {
					message: result.error.issues[0].message,
					code: "INVALID_INPUT",
				},
			});
		}
		const { email, password } = req.body;
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!user)
			return res.status(403).json({
				status: false,
				errors: { message: "User Not Exits", code: "RESOURCE_NOT_EXISTS" },
			});

		// Check the user password.
		const verifyPassword = await compare(password, user.password);

		if (!verifyPassword)
			return res.status(403).json({
				status: false,
				errors: [
					{
						param: "password",
						message: "The credentials you provided are invalid.",
						code: "INVALID_CREDENTIALS",
					},
				],
			});
		const token = sign({ id: user.id, name: user.name }, secret, {
			expiresIn: "1d",
		});
		return res.status(200).json({
			status: true,
			content: {
				meta: {
					acces_token: token,
				},
			},
		});
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
const getMeUser = async (req: express.Request, res: express.Response) => {
	try {
		const { user } = res.locals;
		return res.status(200).json({
			status: true,
			content: {
				data: user,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export { createUser, loginUser, getMeUser };
