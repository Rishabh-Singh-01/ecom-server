import express from 'express';
import {
  getProductUsingId,
  getProducts,
} from '../controllers/productController';

// passport.authenticate('jwt', { session: false }),
export const router = express.Router();

// Getting all the products
router.route('/').get(getProducts);

// Getting a product based on Id
router.route('/:id').get(getProductUsingId);
