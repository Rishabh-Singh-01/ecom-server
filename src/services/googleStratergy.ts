import db from '../db';

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { AppError } from '../utils/AppError';
import { userQuery } from '../query/userQuery';
import { RowDataPacket } from 'mysql2/promise';

// Service for passport - google auth
export const initializeGoogleStartergy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env
          .SERVER_SIDE_URI!}/api/v1/auth/google/callback`,
        passReqToCallback: true,
      },
      async function (req, accessToken, refreshToken, profile, done) {
        const { name, email } = profile._json;

        try {
          // :TODO(p) -- Think if direct connection needed to db or some users endpoint can work
          // CHECKING IF USER EXISTS OR NOT -- getUser
          const [userDetailsByEmail] = await db.query<RowDataPacket[]>(
            userQuery.getUserByEmail,
            email
          );

          // checking if user exists returning success
          if (userDetailsByEmail.length === 1 && userDetailsByEmail.at(0)!.id) {
            req.user = userDetailsByEmail.at(0);
            return done(null, userDetailsByEmail.at(0));
          }

          // IF USER DOESNT EXSITS, CREATE ONE -- createUser
          // creating a user
          await db.query<RowDataPacket[]>(userQuery.createUser, [name, email]);

          // retrieving the newly created user id for the token
          const [userDetails] = await db.query<RowDataPacket[]>(
            userQuery.getUserByEmail,
            email
          );

          // checking if the user created is successfull , if not throw error
          if (userDetails.length !== 1 || !userDetails.at(0))
            return done(null, false, new AppError('Something went wrong', 500));

          // user created successfully , return success
          req.user = userDetails.at(0);
          done(null, userDetails.at(0));
        } catch (err) {
          // incase of internal server errors
          console.log(err);
          // :TODO(p) handle internal server error
          // loggin with a already logged in user and comment out the existing user checker code and leave only the creation one to simulate internal server error like db crashback -- do something with the code below
          // done(new AppError('Something went wrong', 500));
          // for now its being treated as wrong auth
          done(null, false, new AppError('Something went wrong', 500));
        }
      }
    )
  );
};
