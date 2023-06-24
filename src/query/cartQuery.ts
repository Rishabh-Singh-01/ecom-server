export const cartQuery = {
  getItemsFromCart: `SELECT 
  user_id,
  product_id,
  quantity 
  FROM cart_items 
  WHERE user_id = ?;`,
  addItemToCart: `INSERT INTO cart_items
  (user_id,product_id,quantity) 
  VALUE(?,?,?);`,
  updateItemInCart: `UPDATE cart_items
  SET quantity = ?
  WHERE user_id = ? 
  AND product_id = ?;`,
  deleteItemFromCart: `DELETE FROM cart_items 
  WHERE user_id=? 
  AND product_id=?;`,
};
