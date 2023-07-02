import { Router } from 'express';
import passport from 'passport';
import {
  addItemToCart,
  deleteItemFromCart,
  getCartItems,
  updateItemInCart,
} from '../controllers/cartController';

export const router = Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), getCartItems)
  .post(passport.authenticate('jwt', { session: false }), addItemToCart)
  .put(passport.authenticate('jwt', { session: false }), updateItemInCart)
  .delete(passport.authenticate('jwt', { session: false }), deleteItemFromCart);
