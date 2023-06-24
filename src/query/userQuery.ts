export const userQuery = {
  createUser: `INSERT INTO users(id,full_name,email) 
    VALUES(
        uuid(),
        ?, 
        ?
    );
  `,
  getUserByEmail: `SELECT
  users.id
  FROM users
  WHERE users.email = ?`,
};
