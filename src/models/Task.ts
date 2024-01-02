import mongoose from "mongoose";
enum TaskStatus {
	Pending = "pending",
	Overdue = "overdue",
	Completed = "completed",
}

const taskSchema = new mongoose.Schema({
	student: { type: mongoose.Schema.Types.ObjectId, ref: "Students" },
	description: String,
	status: {
		type: String,
		enum: Object.values(TaskStatus),
		default: TaskStatus.Pending,
	},
	dueTime: String,
});

export const Task = mongoose.model("Task", taskSchema);
