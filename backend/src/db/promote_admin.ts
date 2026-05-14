import pool from "./index.ts";

async function promote() {
  try {
    const emails = ['kuldeep12@gmail.com', 'admin12@gmail.com'];
    console.log(`Promoting ${emails.join(', ')} to admin...`);
    
    await pool.query("UPDATE users SET role = 'admin' WHERE email = ANY($1)", [emails]);
    
    console.log("Promotion successful.");
    process.exit(0);
  } catch (err) {
    console.error("Promotion failed:", err);
    process.exit(1);
  }
}

promote();
