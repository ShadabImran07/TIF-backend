/**
 * index.js
 * @description :: member file of community.
 */

import express from "express";
import {
	addMember,
	deleteMember,
} from "../../controllers/member/memberController";
import { verifyToken } from "../../middleware/auth";
const router = express.Router();

router.route("/").post(verifyToken, addMember);
router.route("/:id").post(verifyToken, deleteMember);

export default router;
