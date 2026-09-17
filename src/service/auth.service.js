import * as userRepository from "../repository/users.repository.js";
import { hashPassword, comparePassword } from "../utils/password.helper.js";
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from "../utils/jwt.helper.js";

export const register = async ({ full_name, email, password, role }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    const err = new Error("Email này đã được sử dụng!");
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await hashPassword(password);

  return await userRepository.create({
    full_name,
    email,
    password_hash: hashedPassword,
    role: role || "MEMBER",
  });
};

export const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const err = new Error("Email hoặc mật khẩu không chính xác!");
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    const err = new Error("Email hoặc mật khẩu không chính xác!");
    err.statusCode = 401;
    throw err;
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  // Cấp cặp đôi Access Token (ngắn hạn) và Refresh Token (dài hạn)
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    const err = new Error("Refresh token không được để trống!");
    err.statusCode = 401;
    throw err;
  }

  try {
    // 1. Xác thực refresh token bằng secret riêng
    const decoded = verifyRefreshToken(incomingRefreshToken);

    // 2. Kiểm tra xem người dùng còn tồn tại trong DB không
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      const err = new Error("Người dùng không còn tồn tại!");
      err.statusCode = 404;
      throw err;
    }

    // 3. Tạo access token mới với payload cập nhật
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);

    return {
      accessToken: newAccessToken,
    };
  } catch (error) {
    const err = new Error("Refresh token không hợp lệ hoặc đã hết hạn!");
    err.statusCode = 403;
    throw err;
  }
};

export const getMe = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    const err = new Error("Người dùng không tồn tại trên hệ thống!");
    err.statusCode = 404;
    throw err;
  }
  return user;
};