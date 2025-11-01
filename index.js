import express from "express";
import autoCommitRouter from "./autoCommit.js";

const app = express();
app.use("/auto-commit", autoCommitRouter);

app.listen(8000, () => console.log("✅ Server running on port 8000"));