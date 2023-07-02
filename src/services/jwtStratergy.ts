import { Request } from 'express';
import passport from 'passport';

import { Strategy as JWTstrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJWT } from 'passport-jwt';
import { AppError } from '../utils/AppError';

const extractJwtFromCookie = function (req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

export const initializeJwtStratergy = () => {
  passport.use(
    new JWTstrategy(
      {
        secretOrKey: process.env.JWT_SECRET_KEY,
        jwtFromRequest: ExtractJWT.fromExtractors([extractJwtFromCookie]),
      },
      async (token, done) => {
        try {
          console.log(token);
          return done(null, { id: token.id });
        } catch (error) {
          console.error('this is a error');
          done(null, false, new AppError('Unauthorized request', 401));
        }
      }
    )
  );
};
