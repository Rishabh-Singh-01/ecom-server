import { Request, NextFunction, Response } from 'express';
import { UserWithIdInterface } from '../model/customUserReq';
import { getCookieOptions, signJWT } from '../utils/token';

// controller for failed login requests
// :TODO - remove catchasync and still have no bugs on authRouters
// hopefully this wont be bug or some issue due to using catchAsyncError on non async fn
// export const failedLoginAuth = catchAsyncError(
//   (req: Request, res: Response, next: NextFunction) => {
//     return next(
//       new AppError('You are not logged in! Please log in to get access.', 401)
//     );
//   }
// );

// controller for success login requests
// :TODO - remove catchasync and still have no bugs on authRouters
// hopefully this wont be bug or some issue due to using catchAsyncError on non async fn
export const successLoginAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user as UserWithIdInterface;
  const token = signJWT(id);
  res.cookie('jwt', token, getCookieOptions());
  res.redirect(process.env.CLIENT_SIDE_URI!);
};
