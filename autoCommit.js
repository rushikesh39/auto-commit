// routes/autoCommit.js
import express from "express";
import simpleGit from "simple-git";
import path from "path";

const router = express.Router();
const git = simpleGit(path.resolve("."));

router.get("/", async (req, res) => {
  try {
    const status = await git.status();

    if (status.files.length === 0) {
      return res.status(200).send("No changes to commit.");
    }

    await git.add(".");
    await git.commit(`Auto commit on ${new Date().toLocaleString()}`);
    await git.push("origin", "main"); // adjust branch name if needed

    res.status(200).send("✅ Auto commit and push successful.");
  } catch (error) {
    console.error(error);
    res.status(500).send("❌ Auto commit failed.");
  }
});

export default router;
