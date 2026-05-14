import pool from "./src/db/index.ts";
import dotenv from "dotenv";
dotenv.config();

async function clearLogs() {
  try {
    await pool.query("DELETE FROM activity_logs");
    console.log("Activity logs cleared.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

clearLogs();
