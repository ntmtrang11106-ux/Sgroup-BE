import multer from "multer";

// Sử dụng memoryStorage để lưu tạm file vào buffer của RAM trước khi đẩy lên R2
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Giới hạn kích thước file tối đa 10MB
  },
});