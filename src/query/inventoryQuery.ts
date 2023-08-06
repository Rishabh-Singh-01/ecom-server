export const inventoryQuery = {
  updateInventoryForProduct: `UPDATE 
        inventory
        SET inventory.quantity = inventory.quantity - ?
        WHERE inventory.product_id = ?
        AND inventory.size_id = (
            SELECT id 
            FROM sizes
            WHERE sizes.size_name = ?
        );
    `,
};
