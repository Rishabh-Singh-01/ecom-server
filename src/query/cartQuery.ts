export const cartQuery = {
  getItemsFromCart: `SELECT 
  cart_items.user_id,
  cart_items.product_id,
  sizes.size_name,
  cart_item_variations.quantity,
  products.name,
  products.price,
  products.images
  FROM cart_items
  INNER JOIN products
	  ON cart_items.product_id = products.id
	INNER JOIN cart_item_variations 
    ON cart_items.id = cart_item_variations.cart_item_id
  INNER JOIN sizes 
    ON cart_item_variations.size_id = sizes.id
  WHERE user_id = ?;`,
  getItemFromCartUsingProductId: `SELECT 
  cart_items.user_id,
  cart_items.product_id,
  sizes.size_name,
  cart_item_variations.quantity,
  products.name,
  products.price,
  products.images
  FROM cart_items
  INNER JOIN products
	  ON cart_items.product_id = products.id
	INNER JOIN cart_item_variations 
    ON cart_items.id = cart_item_variations.cart_item_id
  INNER JOIN sizes 
    ON cart_item_variations.size_id = sizes.id
  WHERE user_id = ?
    AND product_id = ?;`,
  addItemToCart: `INSERT INTO cart_items
  (user_id,product_id) 
  VALUE(?,?);`,
  getItemVariationFromCart: `SELECT 
  cart_items.user_id,
  cart_items.product_id,
  sizes.size_name,
  cart_item_variations.quantity,
  products.name,
  products.price,
  products.images
  FROM cart_items
  INNER JOIN products
	  ON cart_items.product_id = products.id
	INNER JOIN cart_item_variations 
    ON cart_items.id = cart_item_variations.cart_item_id
  INNER JOIN sizes 
    ON cart_item_variations.size_id = sizes.id
  WHERE user_id = ?
    AND product_id = ?
    AND sizes.size_name = ?;`,
  addItemVariationToCart: `INSERT INTO cart_item_variations
  (cart_item_id,size_id,quantity) 
  VALUE(
    (SELECT cart_items.id FROM cart_items WHERE user_id = ? AND product_id = ?),
    (SELECT sizes.id FROM sizes WHERE size_name = ?),
    ?
  );`,
  updateItemInCart: `UPDATE cart_item_variations
  SET quantity = ?
  WHERE cart_item_id = (SELECT cart_items.id from cart_items WHERE user_id = ? AND product_id = ?)
  AND size_id = (SELECT id from sizes WHERE size_name = ?);`,
  deleteItemFromCart: `DELETE FROM cart_item_variations 
  WHERE cart_item_id = (SELECT cart_items.id from cart_items WHERE user_id = ? AND product_id = ?)
  AND size_id = (SELECT id from sizes WHERE size_name = ?);`,
};
