/**
 * index.js
 * @description :: user file of community.
 */

import express from "express";
import {
	createUser,
	loginUser,
	getMeUser,
} from "../../controllers/user/userController";
import { verifyToken } from "../../middleware/auth";
const router = express.Router();

router.route("/signup").post(createUser);
router.route("/signin").post(loginUser);
router.route("/me").get(verifyToken, getMeUser);

export default router;
