import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,         
  user: process.env.DB_USER,         
  password: process.env.DB_PASS,     
  database: process.env.DB_NAME, 
  port: process.env.DB_PORT || 3306,
  
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",

  ssl: process.env.DB_SSL === "true"
    ? { rejectUnauthorized: false }
    : undefined
});

const promisePool = pool.promise();
 
promisePool.query("SET NAMES utf8mb4");

export default promisePool;