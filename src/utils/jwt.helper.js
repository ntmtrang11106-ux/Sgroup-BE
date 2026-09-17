import jwt from "jsonwebtoken";

// Tạo Access Token (ngắn hạn)
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "default_jwt_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

// Xác thực Access Token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret");
};

// Tạo Refresh Token (dài hạn)
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "default_refresh_secret", {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

// Xác thực Refresh Token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || "default_refresh_secret");
};