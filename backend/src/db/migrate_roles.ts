import pool from "../db/index.ts";

async function migrate() {
  try {
    console.log("Checking for 'role' column in 'users' table...");
    
    // Check if column exists
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='role';
    `);

    if (checkResult.rows.length === 0) {
      console.log("Column 'role' does not exist. Adding it...");
      await pool.query(`
        ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
      `);
      console.log("Column 'role' added successfully.");
    } else {
      console.log("Column 'role' already exists.");
    }

    // Also ensure we have at least one admin for testing
    // You might want to manually update a user to 'admin' later
    
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
