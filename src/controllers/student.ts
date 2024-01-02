import express from "express";
import { Task } from "../models/Task";

const getStudentTask = async (req: express.Request, res: express.Response) => {
	try {
		const id = res.locals.userid.toString();
		const task = await Task.find({ student: id });
		console.log(task);
		if (!task) {
			res.send(400).json({ message: "No Task found" });
		}
		res.status(200).json(task);
	} catch (error) {
		console.log(error);
		res.status(404).json({ Message: "Internal server Error" });
	}
};
const updateStudentTask = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id, status } = req.body;
		console.log(status, id);
		const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
		console.log(task);
		if (!task) {
			res.send(400).json({ message: "No Task found" });
		}
		res.status(200).json(task);
	} catch (error) {
		console.log(error);
		res.status(404).json({ Message: "Internal server Error" });
	}
};

export { getStudentTask, updateStudentTask };
