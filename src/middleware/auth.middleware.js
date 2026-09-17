import { verifyToken } from "../utils/jwt.helper.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Bạn chưa đăng nhập! Vui lòng cung cấp token hợp lệ.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token của bạn đã hết hạn, vui lòng đăng nhập lại!",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc đã bị chỉnh sửa trái phép!",
    });
  }
};
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện hành động này!",
      });
    }
    next();
  };
};