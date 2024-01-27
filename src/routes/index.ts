import express from "express";
import rateLimit from "express-rate-limit";
import roleRoutes from "./role";
import userRoutes from "./user";
import community from "./community";
import member from "./member";

const rateLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 1000,
	message: "Rate limit exceeded, please try again after 1 minutes",
});

const router = express.Router();

router.use(rateLimiter, roleRoutes);
router.use(rateLimiter, userRoutes);
router.use(rateLimiter, community);
router.use(rateLimiter, member);

export default router;
