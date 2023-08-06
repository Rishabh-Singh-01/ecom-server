import { Router } from 'express';
import passport from 'passport';
import { createOrderForUser } from '../controllers/orderController';

export const router = Router();

router
  .route('/')
  .post(passport.authenticate('jwt', { session: false }), createOrderForUser);
