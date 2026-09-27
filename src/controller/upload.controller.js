
// Upload 1 ảnh đơn lẻ
import * as uploadService from "../service/upload.service.js";
import * as userRepository from "../repository/users.repository.js";

// Upload 1 ảnh và lưu URL vào DB
export const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn 1 file để tải lên!",
      });
    }

    // 1. Upload lên R2 lấy URL HTTPS
    const publicUrl = await uploadService.uploadFileToR2(req.file);

    // 2. Lưu URL vào DB (lấy req.user.id từ middleware authenticateToken)
    let updatedUser = null;
    if (req.user && req.user.id) {
      updatedUser = await userRepository.updateAvatar(req.user.id, publicUrl);
    }

    return res.status(200).json({
      success: true,
      message: "Tải ảnh và lưu URL vào database thành công!",
      data: {
        url: publicUrl,
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Upload tối đa 5 file cùng lúc
export const uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ít nhất 1 file để tải lên!",
      });
    }

    // Đẩy đồng thời tất cả các file lên R2 bằng Promise.all
    const uploadTasks = req.files.map((file) => uploadService.uploadFileToR2(file));
    const urls = await Promise.all(uploadTasks);

    return res.status(200).json({
      success: true,
      message: `Đã tải lên thành công ${urls.length} file!`,
      data: {
        urls,
      },
    });
  } catch (error) {
    next(error);
  }
};