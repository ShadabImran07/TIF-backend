import express from "express";
import { assignTask, addStudents } from "../controllers/admin";
import { getStudentTask, updateStudentTask } from "../controllers/student";
import {
	isAdminAuthenticated,
	isStudentAuthenticated,
} from "../middleware/auth";

const router = express.Router();

router.post(
	"/admin/login",
	isAdminAuthenticated,
	async (req: express.Request, res: express.Response) => {
		res.status(200).json({ message: "Admin login" });
	}
);

router.get("/student", isStudentAuthenticated, getStudentTask);
router.post("/admin/add-student", isAdminAuthenticated, addStudents);
router.post("/admin/assign-task", isAdminAuthenticated, assignTask);
router.put("/studentUpdate", isStudentAuthenticated, updateStudentTask);

export default router;
