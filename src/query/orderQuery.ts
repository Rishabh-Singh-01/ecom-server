export const orderQuery = {
  createOrderForUser: `INSERT INTO orders
  (user_id,status) 
  VALUE(?,?);`,
  getLatestOrderIdForUser: `SELECT
    orders.id
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 1;
  `,
  createOrderItems: `INSERT INTO order_items
    (order_id,product_id,size_id,quantity)
    VALUE(
      ?,
      ?,
      (SELECT sizes.id FROM sizes WHERE sizes.size_name = ?),
      ?
    )
  `,
  updateOrderStatus: `UPDATE orders
      SET orders.status = ?
      WHERE orders.id = ?;
  `,
};
