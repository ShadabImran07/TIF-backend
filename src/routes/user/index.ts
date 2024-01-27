/**
 * index.js
 * @description :: index user file of community.
 */

import express from "express";
import userRoutes from "./userRoutes";
const router = express.Router();

router.use("/auth", userRoutes);

export default router;
