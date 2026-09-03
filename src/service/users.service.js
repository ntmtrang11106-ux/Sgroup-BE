import { readData, writeData } from "../repository/handleData.js";
import { parseUserId } from "../utils/user.helper.js";

export const getAllUsers = async () => {
  const data = await readData();
  return data.users;
};

export const getUserById = async (userId) => {
  const id = parseUserId(userId);
  const data = await readData();
  const user = data.users.find((user) => user.id === id);
  return user || null;
};

export const createUser = async (newUserData) => {
  const data = await readData();
  const nextId =
    data.users.length > 0 ? Math.max(...data.users.map((u) => u.id)) + 1 : 1;

  const newUser = {
    id: nextId,
    ...newUserData,
  };

  data.users.push(newUser);
  await writeData(data);
  return newUser;
};

export const updateUser = async (userId, updateData) => {
  const id = parseUserId(userId);
  const data = await readData();
  const index = data.users.findIndex((user) => user.id === id);

  if (index === -1) {
    return null;
  }

  data.users[index] = {
    ...data.users[index],
    ...updateData,
    id: id,
  };

  await writeData(data);
  return data.users[index];
};

export const deleteUser = async (userId) => {
  const id = parseUserId(userId);
  const data = await readData();
  const index = data.users.findIndex((user) => user.id === id);

  if (index === -1) {
    return false;
  }

  data.users.splice(index, 1);
  await writeData(data);
  return true;
};