import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
	name: String,
	email: String,
	department: String,
	password: String,
});

export const Students = mongoose.model("Students", studentSchema);
