export const productQuery = {
  getAllProducts: `SELECT
	products.id,
    products.name,
    products.description,
    products.images,
    products.previous_price,
    products.price,
    inventory.quantity,
    product_categories.category_name,
    sizes.size_name,
    sizes.size_description
    FROM products
    join inventory ON products.inventory_id = inventory.id
    JOIN product_categories ON products.category_id = product_categories.id
    JOIN sizes ON inventory.size_id = sizes.id
    WHERE 1 = 1`,
  getProductUsingId: `SELECT
	products.id,
    products.name,
    products.description,
    products.images,
    products.previous_price,
    products.price,
    inventory.quantity,
    product_categories.category_name,
    sizes.size_name,
    sizes.size_description
    FROM products
    join inventory ON products.inventory_id = inventory.id
    JOIN product_categories ON products.category_id = product_categories.id
    JOIN sizes ON inventory.size_id = sizes.id
    WHERE products.id = ?`,
};
