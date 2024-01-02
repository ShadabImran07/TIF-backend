import express from "express";
import http from "http";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import * as dotenv from "dotenv";
import routes from "./routes/Routes";
import mongoose from "mongoose";
dotenv.config();

const app = express();

app.use(
	cors({
		credentials: true,
	})
);

app.use(express.json({ limit: "50mb" }));
app.use(compression());
app.use(bodyParser.json());

const server = http.createServer(app);

app.use("/api", routes);

app.get("/", async (req, res) => {
	res.send("hello world");
});
server.listen(8080, () => {
	console.log("Server running on http://localhost:8080/");
});
// DB URI

mongoose.Promise = Promise;
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));
