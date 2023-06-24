import express, { Express, Request, NextFunction, Response } from 'express';
import passport from 'passport';
import { initializeGoogleStartergy } from '../services/googleStratergy';
import { successLoginAuth } from '../controllers/authController';
export const router = express.Router();

initializeGoogleStartergy();
// Mouting routes for failed auth
// router.get('/login/failed', failedLoginAuth);

// Mounting routes for success auth for getting the info of the user that is just logged in

// Mounting routers for google oauth2
router
  .route('/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/google/callback').get(
  passport.authenticate('google', {
    session: false,
    failureRedirect: process.env.CLIENT_SIDE_URI! + '/error',
  }),
  successLoginAuth
);
