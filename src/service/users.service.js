import { readData, writeData } from "../repository/readData.js";

export const getAllUsers = async () => {
  try {
    const data = await readData();
    return data.users;
  }
  catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export const getUserById = async (userId) => {
  try {
    const data = await readData();

    const user = data.users.find(user => user.id === parseInt(userId));
    return user || null;
  }
  catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
}

export const updateUser = async (userId, updateData) => {
  try {
    const data = await readData();
    const id = parseInt(userId);
    const index = data.users.findIndex(user => user.id === id);

    if (index === -1) {
      return null;
    }

    // Cập nhật thông tin user và giữ nguyên ID
    data.users[index] = {
      ...data.users[index],
      ...updateData,
      id: id
    };

    await writeData(data);
    return data.users[index];
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const data = await readData();
    const id = parseInt(userId);
    const index = data.users.findIndex(user => user.id === id);

    if (index === -1) {
      return false;
    }

    data.users.splice(index, 1);
    await writeData(data);
    return true;
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
};