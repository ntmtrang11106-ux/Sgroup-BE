import express from "express";
import router from "./route/route.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// 1. CÁC MIDDLEWARE ĐỨNG TRƯỚC (Theo đúng hình của bạn)
app.use(express.json());             // Đọc JSON body
// app.use(authMiddleware);         // Xác thực (nếu có)
// app.use(loggingMiddleware);      // Ghi log (nếu có)

// 2. ROUTES VÀ CÁC TẦNG CONTROLLER / SERVICE
app.use("/", router);

// 3. ERROR MIDDLEWARE ĐỨNG SAU CÙNG (Chỉ chạy khi bước 2 gặp lỗi)
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});