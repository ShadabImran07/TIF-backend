/**
 * index.js
 * @description :: index role file of community.
 */

import express from "express";
import RoleRoutes from "./roleRoute";
const router = express.Router();

router.use("/role", RoleRoutes);

export default router;
