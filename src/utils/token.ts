import jwt from 'jsonwebtoken';

export const signJWT = (id: string) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });

  return token;
};

export const getCookieOptions = () => {
  const cookieOptions = {
    // :TODO(p) - Make token and cookie expire at the same time
    expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
    httpOnly: true,
  };
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  return cookieOptions;
};
