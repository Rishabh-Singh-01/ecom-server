export const productQuery = {
  getAllProducts: `SELECT
	products.id,
    products.name,
    products.description,
    products.images,
    products.price,
    product_categories.category_name,
    themes.title AS theme_title
    FROM products
    JOIN product_categories ON products.category_id = product_categories.id
    JOIN themes ON products.theme_id = themes.id
    WHERE 1 = 1`,
  getProductUsingId: `SELECT
	products.id,
    products.name,
    products.description,
    products.images,
    products.previous_price,
    products.price,
    products.fabric,
    inventory.quantity,
    product_categories.category_name,
    sizes.size_name,
    sizes.size_description,
    themes.title AS theme_title
    FROM products
    join inventory ON products.id = inventory.product_id
    JOIN product_categories ON products.category_id = product_categories.id
    JOIN sizes ON inventory.size_id = sizes.id
    JOIN themes ON products.theme_id = themes.id
    WHERE products.id = ?`,
};
