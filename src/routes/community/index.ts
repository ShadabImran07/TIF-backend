/**
 * index.js
 * @description :: index community file of community.
 */

import express from "express";
import communityRoutes from "./communityRoutes";
const router = express.Router();

router.use("/community", communityRoutes);

export default router;
