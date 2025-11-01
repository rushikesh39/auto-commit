// autoUpdate.js
import "dotenv/config";
import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

const git = simpleGit();

// File to update automatically
const filePath = path.resolve("./auto-log.txt");

const autoUpdate = async () => {
  try {
    const timestamp = new Date().toLocaleString();

    // ✅ Step 1: Create or update file
    fs.appendFileSync(filePath, `\nAuto update at ${timestamp}`);
    console.log(`📝 File updated at ${timestamp}`);

    // ✅ Step 2: Configure Git user (from environment variables)
    await git.addConfig("user.name", process.env.GIT_USERNAME);
    await git.addConfig("user.email", process.env.GIT_EMAIL);

    // ✅ Step 3: Ensure remote URL uses GitHub token authentication
    const repoUrl = `https://${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}.git`;
    await git.remote(["set-url", "origin", repoUrl]);

    // ✅ Step 4: Add, commit, push
    await git.add(".");
    await git.commit(`Auto update at ${timestamp}`);
    await git.push("origin", "main");

    console.log("✅ Auto commit and push successful.");
  } catch (error) {
    console.error("❌ Auto commit failed:", error.message);
  }
};

autoUpdate();
