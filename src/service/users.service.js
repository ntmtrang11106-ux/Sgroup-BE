import * as usersRepo from "../repository/users.repository.js";
import { parseUserId } from "../utils/user.helper.js";

export const getAllUsers = async () => {
  return await usersRepo.findAll();
};

export const getUserById = async (userId) => {
  const id = parseUserId(userId);
  return await usersRepo.findById(id);
};

export const createUser = async (userData) => {
  return await usersRepo.create(userData);
};

export const updateUser = async (userId, updateData) => {
  const id = parseUserId(userId);
  return await usersRepo.update(id, updateData);
};

export const deleteUser = async (userId) => {
  const id = parseUserId(userId);
  return await usersRepo.deleteById(id);
};