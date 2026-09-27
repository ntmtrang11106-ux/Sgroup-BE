import { Router } from "express";
import { upload } from "../middleware/upload.middleware.js";
import * as uploadController from "../controller/upload.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// Upload 1 file đơn lẻ (Field name trong form-data là: "file")
router.post("/single", authenticateToken, upload.single("file"), uploadController.uploadSingleImage);

// Upload nhiều file, tối đa 5 file (Field name trong form-data là: "files")
router.post("/multiple", authenticateToken, upload.array("files", 5), uploadController.uploadMultipleFiles);

export default router;