/**
 * index.js
 * @description :: community file of community.
 */

import express from "express";
import {
	createCommunity,
	getAllCommunity,
	getOwnerCommunity,
	getCommunityMembers,
	getMyJoinedCommunity,
} from "../../controllers/community/communityController";
import { verifyToken } from "../../middleware/auth";
const router = express.Router();

router.route("/").post(verifyToken, createCommunity);
router.route("/").get(getAllCommunity);
router.route("/me/owner").get(verifyToken, getOwnerCommunity);
router.route("/:id/members").get(getCommunityMembers);
router.route("/me/member").get(verifyToken, getMyJoinedCommunity);

export default router;
