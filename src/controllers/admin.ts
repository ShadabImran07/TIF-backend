import express from "express";
import { Students } from "../models/Students";
import { Task } from "../models/Task";

const addStudents = async (req: express.Request, res: express.Response) => {
	try {
		const { name, email, department, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "password and email are required" });
		}

		const studentExits = await Students.findOne({ email });

		if (studentExits) {
			return res.status(400).json({ message: "student already exists" });
		}
		const student = await Students.create({
			name,
			email,
			password,
			department,
		});
		res.status(201).json({
			_id: student._id,
			name: student.name,
			email: student.email,
			department: student.department,
		});
	} catch (error: any) {
		res.status(500).json({ message: "Internal Server Error" });
		console.log(error);
	}
};

const assignTask = async (req: express.Request, res: express.Response) => {
	try {
		const { id, description, dueTime } = req.body;
		if (!id || !description || !dueTime) {
			res.status(400).json({ message: "id and description,dueTime required" });
		}
		const studentsExit = await Students.findById(id);
		if (!studentsExit) {
			res.status(400).json({ message: "No students found" });
		}
		const task = await Task.create({
			id,
			student: studentsExit._id,
			description,
			dueTime,
		});
		res.status(201).json({
			_id: task._id,
			student: studentsExit._id,
			status: task.status,
			description: task.description,
		});
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export { addStudents, assignTask };
