/**
 * index.js
 * @description :: index member file of community.
 */

import express from "express";
import memberRoutes from "./memberRoutes";
const router = express.Router();

router.use("/member", memberRoutes);

export default router;
