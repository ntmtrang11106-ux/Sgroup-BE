import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import path from "path";

// Khởi tạo S3 Client kết nối tới Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Hàm upload 1 file đơn lẻ lên R2 và trả về URL công khai
export const uploadFileToR2 = async (file) => {
  const fileExt = path.extname(file.originalname);
  // Đặt tên file ngẫu nhiên để không bị trùng lặp: timestamp-randomString.ext
  const uniqueKey = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${fileExt}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: uniqueKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  // Ghép với domain công khai đã bật ở bước trước
  return `${process.env.R2_PUBLIC_URL}/${uniqueKey}`;
};