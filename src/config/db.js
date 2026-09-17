import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL successfully");
    client.release();
  } catch (error) {
    // In toàn bộ object error để thấy rõ nguyên nhân (sai pass, sai port, hay chưa start service)
    console.error("PostgreSQL connection failed:", error);
    process.exit(1);
  }
};