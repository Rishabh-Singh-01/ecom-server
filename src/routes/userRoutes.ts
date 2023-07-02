import express from 'express';
import passport from 'passport';

export const router = express.Router();

// creating a user based on google oauth2.0 full_name and emailId

// router
//   .route('/me')
//   .get(passport.authenticate('jwt', { session: false }), getMyDetails);
