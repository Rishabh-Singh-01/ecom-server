import app from '../../src/app';
import db from '../../src/db';
import request from 'supertest';

interface ProductSmallInterface {
  id: string;
  name: string;
  description: string;
  images: string;
  price: number;
  category_name: string;
  theme_title: string;
  gender_category_name: string;
}

interface ProductInterface {
  id: string;
  name: string;
  description: string;
  images: string;
  previous_price: number;
  price: number;
  fabric: string;
  quantity: number;
  category_name: string;
  size_name: string;
  size_description: string;
  theme_title: string;
  gender_category_name: string;
}

describe('Testing Product Get Routes --> /products', () => {
  let productId = 'this id wont work';

  afterAll(async () => {
    db.end()
      .then(() => console.log('Closing database connection pool via test'))
      .catch((err) => console.error('Error closing pool via test', err));
  });

  // -----------------------------------------------------------------------

  test('Returns all the products ( 200 ) when get products [ /products ] is called', async () => {
    // using app to get the res from a route
    const res = await request(app).get('/api/v1/products');

    // checking response type
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.results).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(res.body.data.data)).toBe(true);
    expect(res.body.data.data.length).toBeGreaterThanOrEqual(0);
    if (res.body.data.data.length > 0) {
      const dataObj: ProductSmallInterface = res.body.data.data.at(0);
      expect(typeof dataObj.id).toBe('string');
      expect(typeof dataObj.name).toBe('string');
      expect(typeof dataObj.images).toBe('string');
      expect(typeof dataObj.description).toBe('string');
      expect(typeof dataObj.category_name).toBe('string');
      expect(typeof dataObj.theme_title).toBe('string');
      expect(typeof dataObj.gender_category_name).toBe('string');
      expect(typeof dataObj.price).toBe('number');

      productId = dataObj.id;
    }
  });

  // -----------------------------------------------------------------------

  test('Returns a single product ( 200 ) when get products with id [ /products/<someValidId> ] is called', async () => {
    // using app to get the res from a route
    const res = await request(app).get(`/api/v1/products/${productId}`);
    console.log(`/api/v1/products/${productId}`);

    // checking response type
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toEqual('success');
    // :TODO(p) -- also expect size in this as well
    expect(res.body.results).toBeGreaterThanOrEqual(1); // greater as size here will give different objs
    expect(Array.isArray(res.body.data.data)).toBe(true);
    expect(res.body.data.data.length).toBeGreaterThanOrEqual(1);

    const dataObj: ProductInterface = res.body.data.data.at(0);
    expect(typeof dataObj.id).toBe('string');
    expect(typeof dataObj.name).toBe('string');
    expect(typeof dataObj.images).toBe('string');
    expect(typeof dataObj.description).toBe('string');
    expect(typeof dataObj.category_name).toBe('string');
    expect(typeof dataObj.theme_title).toBe('string');
    expect(typeof dataObj.gender_category_name).toBe('string');
    expect(typeof dataObj.fabric).toBe('string');
    expect(typeof dataObj.size_name).toBe('string');
    expect(typeof dataObj.size_description).toBe('string');
    expect(typeof dataObj.price).toBe('number');
    expect(typeof dataObj.previous_price).toBe('number');
    expect(typeof dataObj.quantity).toBe('number');
    expect(dataObj.quantity).toBeGreaterThanOrEqual(0);
  });

  // -----------------------------------------------------------------------

  test('Returns no product found error response ( 404 ) when get products with invalid id [ /products/<someInvalidId> ] is called', async () => {
    // using app to get the res from a route
    const res = await request(app).get('/api/v1/products/someInvalidId');

    // checking response type
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toEqual('Fail');
    expect(typeof res.body.message).toBe('string');
  });
});
