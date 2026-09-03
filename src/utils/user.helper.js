export const parseUserId = (id) => {
  const parsedId = Number.parseInt(id, 10);
  if (Number.isNaN(parsedId) || parsedId <= 0) {
    const error = new Error("Invalid User ID");
    error.statusCode = 400;
    throw error;
  }
  return parsedId;
};