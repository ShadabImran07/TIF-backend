import express from "express";
import prisma from "../../config/db.config";
import { Snowflake } from "@theinternetfolks/snowflake";

import { z } from "zod";
const itemsPerPage = 5;

const createCommunityValidetor = z.object({
	name: z
		.string({
			required_error: "name is required",
			invalid_type_error: "name must be a string",
		})
		.min(2, { message: "name length must be Grater than 2" }),
});

const createCommunity = async (req: express.Request, res: express.Response) => {
	try {
		const result = createCommunityValidetor.safeParse(req.body);
		if (!result.success) {
			return res.status(403).json({
				status: false,
				errors: { message: result.error.issues[0].message },
			});
		}
		const { name } = req.body;
		const { user } = res.locals;
		const community = await prisma.community.create({
			data: {
				id: Snowflake.generate(),
				name: name,
				slug: name,
				ownerId: user.id,
			},
		});
		const defaultRoleName: string = "community Admin";

		const defaultRole = await prisma.role.findUnique({
			where: {
				name: defaultRoleName,
			},
		});

		if (!defaultRole) {
			// Handle the case where the default role is not found
			return res
				.status(500)
				.json({ message: "community Admin role not found" });
		}

		await prisma.member.create({
			data: {
				id: Snowflake.generate(),
				userId: user.id,
				roleId: defaultRole.id,
				communityId: community.id,
			},
		});

		return res.status(200).json({
			status: true,
			content: {
				data: community,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const getAllCommunity = async (req: express.Request, res: express.Response) => {
	try {
		const { pageNumber } = req.query;

		const parsedPageNumber = pageNumber
			? parseInt(pageNumber as string, 10)
			: 1;
		const skip: number = (parsedPageNumber - 1) * itemsPerPage;
		const totalCount = await prisma.community.count();
		const totalPages = Math.ceil(totalCount / itemsPerPage);
		const response = await prisma.community.findMany({
			skip: skip,
			take: itemsPerPage,

			include: {
				owner: {
					select: {
						id: true,
						name: true,
					},
				},
			},
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
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const getOwnerCommunity = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { user } = res.locals;
		const { pageNumber } = req.query;

		const parsedPageNumber = pageNumber
			? parseInt(pageNumber as string, 10)
			: 1;
		const skip: number = (parsedPageNumber - 1) * itemsPerPage;
		const totalCount = await prisma.community.count({
			where: {
				ownerId: user.id,
			},
		});
		const totalPages = Math.ceil(totalCount / itemsPerPage);
		const response = await prisma.community.findMany({
			skip: skip,
			take: itemsPerPage,
			where: {
				ownerId: user.id,
			},
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
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const getCommunityMembers = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params;
		const { pageNumber } = req.query;

		const parsedPageNumber = pageNumber ? parseInt(pageNumber as string, 5) : 1;
		const skip: number = (parsedPageNumber - 1) * itemsPerPage;
		const totalCount = await prisma.member.count({
			where: {
				communityId: id,
			},
		});
		const totalPages = Math.ceil(totalCount / itemsPerPage);

		const members = await prisma.member.findMany({
			skip: skip,
			take: itemsPerPage,
			where: {},
			include: {
				role: {
					select: {
						id: true,
						name: true,
					},
				},
				user: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});
		if (!members) {
			return res.status(404).json({
				status: false,
				errors: [
					{
						message: "community not found.",
						code: "RESOURCE_NOT_FOUND",
					},
				],
			});
		}
		return res.status(200).json({
			status: true,
			content: {
				meta: {
					total: totalCount,
					pages: totalPages,
					page: parsedPageNumber,
				},
				data: members,
			},
		});
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const getMyJoinedCommunity = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { pageNumber } = req.query;
		const { user } = res.locals;

		const parsedPageNumber = pageNumber
			? parseInt(pageNumber as string, 10)
			: 1;
		const skip: number = (parsedPageNumber - 1) * itemsPerPage;

		const totalCount = await prisma.community.count({
			where: {
				ownerId: user.id,
			},
		});
		const totalPages = Math.ceil(totalCount / itemsPerPage);

		const response = await prisma.community.findMany({
			where: {
				ownerId: user.id,
			},
			skip: skip,
			take: itemsPerPage,
			include: {
				// Include owner with only id and name details
				owner: {
					select: {
						id: true,
						name: true,
					},
				},
			},
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
	} catch (error) {}
};

export {
	createCommunity,
	getAllCommunity,
	getOwnerCommunity,
	getCommunityMembers,
	getMyJoinedCommunity,
};
