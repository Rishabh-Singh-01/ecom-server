import app from '../../src/app';
import db from '../../src/db';
import request from 'supertest';

interface SingleTheme {
  id: string;
  title: string;
  image: string;
  description: string;
}

describe('Testing themes routes --> /themes', () => {
  afterAll(() => {
    db.end()
      .then(() => console.log('Closing database connection pool via test'))
      .catch((err) => console.error('Error closing pool via test', err));
  });

  test('Returning all the themes ( 200 ) when get themes [ /themes ] is called', async () => {
    const res = await request(app).get('/api/v1/themes');

    // asserting the response
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.results).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data.data)).toBe(true);

    const resBodyObj: SingleTheme = res.body.data.data.at(0);
    expect(typeof resBodyObj.id).toBe('string');
    expect(typeof resBodyObj.title).toBe('string');
    expect(typeof resBodyObj.image).toBe('string');
    expect(typeof resBodyObj.description).toBe('string');
  });
});
