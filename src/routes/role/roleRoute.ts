/**
 * index.js
 * @description :: role file of community.
 */

import express from "express";
import {
	createRole,
	getAllRoles,
} from "../../controllers/role/roleControllers";
const router = express.Router();

router.route("/").post(createRole);
router.route("/").get(getAllRoles);

export default router;
