import pool from "./src/db/index.ts";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
console.log("JWT_SECRET present:", !!process.env.JWT_SECRET);
console.log("JWT_SECRET value:", process.env.JWT_SECRET);

const token = jwt.sign({ test: "data" }, process.env.JWT_SECRET || "fallback-secret");
try {
  jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
  console.log("JWT Self-test: SUCCESS");
} catch (err) {
  console.error("JWT Self-test: FAILED", err);
}
process.exit(0);
