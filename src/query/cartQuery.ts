export const cartQuery = {
  getItemsFromCart: `SELECT 
  cart_items.user_id,
  cart_items.product_id,
  cart_items.quantity,
  products.name,
  products.price,
  products.images
  FROM cart_items
  INNER JOIN products
	ON cart_items.product_id = products.id
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
