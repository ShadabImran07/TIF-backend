import express from "express";
import prisma from "../../config/db.config";
import { Snowflake } from "@theinternetfolks/snowflake";

import { z } from "zod";

const createMemberValidetor = z.object({
	user: z.string({
		required_error: "user id is required",
		invalid_type_error: "user id  must be a string",
	}),

	community: z.string({
		required_error: "community id is required",
		invalid_type_error: "community id  must be a string",
	}),
	role: z.string({
		required_error: "role id is required",
		invalid_type_error: "role id  must be a string",
	}),
});

const addMember = async (req: express.Request, res: express.Response) => {
	try {
		const result = createMemberValidetor.safeParse(req.body);
		if (!result.success) {
			return res.status(403).json({
				status: false,
				error: { message: result.error.issues[0].message },
			});
		}
		const { community: communityId, user: userId, role: roleId } = req.body;
		const { user } = res.locals;

		// Check if the user is a community admin in the specified community
		const isAdmin = await prisma.member.findFirst({
			where: {
				userId: user.id,
				role: { name: "community Admin" },
			},
		});

		if (!isAdmin) {
			return res.status(401).json({
				status: false,
				errors: [
					{
						message: "You are not authorized to perform this action.",
						code: "NOT_ALLOWED_ACCESS",
					},
				],
			});
		}

		// Check if the community exists
		const communityExists = await prisma.community.findUnique({
			where: { id: communityId },
		});

		if (!communityExists) {
			return res.status(403).json({
				status: false,
				errors: [
					{
						param: "community",
						message: "Community not found.",
						code: "RESOURCE_NOT_FOUND",
					},
				],
			});
		}

		// Check if the user exists
		const userExists = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!userExists) {
			return res.status(403).json({
				status: false,
				errors: [
					{
						param: "user",
						message: "User not found.",
						code: "RESOURCE_NOT_FOUND",
					},
				],
			});
		}

		// Check if the user is already a member with the specified role in the community
		const memberExists = await prisma.member.findFirst({
			where: {
				userId: userId,
				roleId: roleId,
				communityId: communityId,
			},
		});

		if (memberExists) {
			return res.status(401).json({
				status: false,
				errors: [
					{
						message: "User is already added in the community.",
						code: "RESOURCE_EXISTS",
					},
				],
			});
		}

		// Create a new member
		const response = await prisma.member.create({
			data: {
				id: Snowflake.generate(),
				userId: userId,
				roleId: roleId,
				communityId: communityId,
			},
		});

		return res.status(200).json({
			status: true,
			content: {
				data: response,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
const deleteMember = async (req: express.Request, res: express.Response) => {
	try {
		const { id } = req.params;
		const { user } = res.locals;
		const isAdmin = await prisma.member.findFirst({
			where: {
				userId: user.id,
				role: { name: "community Admin" },
			},
		});
		console.log(isAdmin);

		if (!isAdmin) {
			return res.status(401).json({
				status: false,
				errors: [
					{
						message: "You are not authorized to perform this action.",
						code: "NOT_ALLOWED_ACCESS",
					},
				],
			});
		}
		const memberToRemove = await prisma.member.findUnique({
			where: {
				id: id,
			},
		});

		if (!memberToRemove) {
			return res.status(404).json({
				status: false,
				errors: [
					{
						message: "Member not found.",
						code: "RESOURCE_NOT_FOUND",
					},
				],
			});
		}

		// Proceed with removing the member
		const removedMember = await prisma.member.delete({
			where: {
				id: id,
			},
		});

		return res.status(200).json({
			status: true,
			content: {
				data: removedMember,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export { addMember, deleteMember };
