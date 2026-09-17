import "dotenv/config";
import express from "express";
import router from "./route/route.js";
import { connectDB } from "./config/db.js"; // 👉 Thêm kết nối DB
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Khởi chạy kết nối PostgreSQL
connectDB();

app.use(express.json());

// Thêm route này để khi mở http://localhost:3000 sẽ không bị "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Server is ready and running!");
});

// Các route chính (/users...)
app.use("/", router);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});