import * as authService from "../service/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const newUser = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Đăng ký tài khoản thành công!",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Đăng nhập thành công!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    // Lấy refresh token từ body (hoặc từ req.cookies.refreshToken nếu dùng cookie)
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Cấp lại Access Token thành công!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userProfile = await authService.getMe(req.user.id);
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Lấy thông tin cá nhân thành công!",
      data: userProfile,
    });
  } catch (error) {
    next(error);
  }
};