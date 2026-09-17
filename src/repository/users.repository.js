import { pool } from "../config/db.js";


export const findByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
};

export const findById = async (id) => {
  const result = await pool.query(
    "SELECT id, full_name, email, role, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

export const create = async ({ full_name, email, password_hash, role = "MEMBER" }) => {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, full_name, email, role, created_at`,
    [full_name, email, password_hash, role]
  );
  return result.rows[0];
};
// Lấy tất cả users
export const findAll = async () => {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
  return result.rows;
};

// Cập nhật user
export const update = async (id, { name, email, age }) => {
  const query = `
    UPDATE users
    SET 
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      age = COALESCE($3, age)
    WHERE id = $4
    RETURNING *;
  `;
  const values = [name, email, age, id];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

// Xóa user
export const deleteById = async (id) => {
  const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
  return result.rowCount > 0;
};