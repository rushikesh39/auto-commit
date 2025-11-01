// routes/autoCommit.js
import express from "express";
import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

const router = express.Router();
const git = simpleGit();

router.get("/", async (req, res) => {
  try {
    const timestamp = new Date().toLocaleString();
    const filePath = path.resolve("./auto-log.txt");

    // ✅ Step 1: Update or create file
    fs.appendFileSync(filePath, `\nAuto update at ${timestamp}`);
    console.log(`📝 File updated at ${timestamp}`);

    // ✅ Step 2: Git user config
    await git.addConfig("user.name", process.env.GIT_USERNAME);
    await git.addConfig("user.email", process.env.GIT_EMAIL);

    // ✅ Step 3: Use token-based remote
    const repoUrl = `https://${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}.git`;
    await git.remote(["set-url", "origin", repoUrl]);

    // ✅ Step 4: Commit and push
    await git.add(".");
    await git.commit(`Auto update at ${timestamp}`);
    await git.push("origin", "main");

    console.log("✅ Auto commit and push successful.");
    res.status(200).send("✅ Auto commit and push successful.");
  } catch (error) {
    console.error("❌ Auto commit failed:", error.message);
    res.status(500).send(`❌ Auto commit failed: ${error.message}`);
  }
});

export default router;
