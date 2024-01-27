import express from "express";
import prisma from "../../config/db.config";
import { Snowflake } from "@theinternetfolks/snowflake";

import { z } from "zod";

const createRoleValidator = z.string().min(2);

const itemsPerPage = 5;

const createRole = async (req: express.Request, res: express.Response) => {
	try {
		const { name } = req.body;
		const result = createRoleValidator.safeParse(name);
		if (!result.success) {
			return res.status(403).json({ message: result.error.issues[0].message });
		}
		const response = await prisma.role.create({
			data: {
				id: Snowflake.generate(),
				name: name,
			},
		});
		return res.status(201).json({
			status: true,
			content: {
				data: response,
			},
		});
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const getAllRoles = async (req: express.Request, res: express.Response) => {
	try {
		const { pageNumber } = req.query;

		const parsedPageNumber = pageNumber
			? parseInt(pageNumber as string, 10)
			: 1;
		const skip: number = (parsedPageNumber - 1) * itemsPerPage;
		const totalCount = await prisma.role.count();
		const totalPages = Math.ceil(totalCount / itemsPerPage);
		const response = await prisma.role.findMany({
			skip: skip,
			take: itemsPerPage,
		});
		return res.status(200).json({
			status: true,
			content: {
				meta: {
					total: totalCount,
					pages: totalPages,
					page: parsedPageNumber,
				},
				data: response,
			},
		});
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export { createRole, getAllRoles };
