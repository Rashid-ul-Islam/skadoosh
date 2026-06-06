import dotenv from "dotenv";
import pool from "./config/db.js";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import dns from "dns";

//change DNS
dns.setServers(["8.8.8.8","1.1.1.1"])


const app = express();
app.use(cors());
app.use(express.json());
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
); // helmet is a security middleware that helps you protect your app by setting various HTTP headers
app.use(morgan("dev")); // log the requests
dotenv.config();


const PORT = process.env.PORT || 5000;
await pool();

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});