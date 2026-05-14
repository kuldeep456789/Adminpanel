import pool from "./src/db/index.ts";
import dotenv from "dotenv";
dotenv.config();

async function checkSchema() {
  try {
    const { rows } = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects'
    `);
    console.log("Projects Columns:", rows);

    const { rows: activityRows } = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'activity_logs'
    `);
    console.log("Activity Logs Columns:", activityRows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
