import * as usersRepo from "../repository/users.repository.js";

// Trong validateCreateUser:
const existingUser = await usersRepo.findByEmail(email.trim());
if (existingUser) {
  return res.status(409).json({
    success: false,
    message: "Email is already in use"
  });
}

// Trong validateUpdateUser:
if (email) {
  const existingUser = await usersRepo.findByEmail(email.trim());
  if (existingUser && existingUser.id !== currentUserId) {
    return res.status(409).json({
      success: false,
      message: "Email is already in use by another user"
    });
  }
}