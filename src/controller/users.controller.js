import * as usersService from "../service/users.service.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await usersService.getAllUsers();
  res.status(200).json({ success: true, message: "Users retrieved successfully", data: users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await usersService.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, message: "User retrieved successfully", data: user });
});

export const createUser = asyncHandler(async (req, res) => {
  const newUser = await usersService.createUser(req.body);
  res.status(201).json({ success: true, message: "User created successfully", data: newUser });
});

export const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await usersService.updateUser(req.params.id, req.body);
  if (!updatedUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const isDeleted = await usersService.deleteUser(req.params.id);
  if (!isDeleted) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, message: "User deleted successfully" });
});