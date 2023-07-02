import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2/promise';

import db from '../db';
import { AppError } from '../utils/AppError';
import { catchAsyncError } from '../utils/catchAsyncError';

// export const getMyDetails = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // validating userId
//     // :TODO(q) - Cond where only logged in user id and userId from params match so only logged in user can see its only cart
//     const userId = req.params.id;
//     if (!userId || typeof userId !== 'string')
//       throw new AppError('Unauthorized request', 401);

//     // feching cart items per userId
//     const [rows] = await db.query<RowDataPacket[]>(
//       cartQuery.getItemsFromCart,
//       userId
//     );

//     // sending the items
//     res.status(200).json({
//       status: 'success',
//       results: rows.length,
//       data: {
//         data: rows,
//       },
//     });
//   }
// );

// Controller for checking if user is present or not
// export const getUserByEmail = catchAsyncError(
//   async (req: CustomUserReq, res: Response, next: NextFunction) => {
//     console.log('started getUserByEmail for google signup');

//     // due to special google signup process
//     const { name, email } = req.user._json;

//     // :TODO(p) validate email using some regex

//     // Reject different type
//     if (typeof name !== 'string' || typeof email !== 'string') {
//       return next(new AppError('Please provide valid credentials', 400));
//     }

//     // retrieving the user id for the token
//     const [userDetails] = await db.query<RowDataPacket[]>(
//       userQuery.getUserByEmail,
//       email
//     );

//     console.log(userDetails);

//     // more than one user for a email tho it wont be possible
//     if (!userDetails.at(0) && userDetails.at(0)?.length !== 1)
//       return next(new AppError('Something went wrong', 500));

//     // :TODO(l) perform roleback in case token isnt created and revert database back to without the newly inserted user
//     const { id } = userDetails.at(0)!;

//     return id;
//   }
// );

// // Controller for creating new user
// export const createNewUser = catchAsyncError(async (email: string) => {
//   console.log('started createNewUser for google signup');

//   // :TODO(p) validate email using some regex

//   // Reject different type
//   if (typeof email !== 'string') {
//     throw new AppError('Please provide valid credentials', 400);
//   }

//   // creating a user
//   await db.query<RowDataPacket[]>(userQuery.createUser, [name, email]);

//   // retrieving the newly created user id for the token
//   const [userDetails] = await db.query<RowDataPacket[]>(
//     userQuery.getUserByEmail,
//     email
//   );

//   const { id } = userDetails.at(0)!;

//   return id;
// });

// // Controller for creating new user
// export const createNewUser = catchAsyncError(
//   async (req: CustomUserReq, res: Response, next: NextFunction) => {
//     console.log('started createNewUser for google signup');

//     // due to special google signup process
//     const { name, email } = req.user._json;

//     // :TODO(p) validate email using some regex

//     // Reject different type
//     if (typeof name !== 'string' || typeof email !== 'string') {
//       return next(new AppError('Please provide valid credentials', 400));
//     }

//     // creating a user
//     await db.query<RowDataPacket[]>(userQuery.createUser, [name, email]);

//     // retrieving the newly created user id for the token
//     const [userDetails] = await db.query<RowDataPacket[]>(
//       userQuery.getUserByEmail,
//       email
//     );

//     // more than one user for a email tho it wont be possible
//     if (!userDetails.at(0) && userDetails.at(0)?.length !== 1)
//       return next(new AppError('Something went wrong', 500));

//     // :TODO(l) perform roleback in case token isnt created and revert database back to without the newly inserted user
//     const { id } = userDetails.at(0)!;

//     console.log(userDetails);

//     res.redirect(process.env.CLIENT_SIDE_URI!);

//     // res.status(201).json({
//     //   status: 'success',
//     //   results: userDetails.at(0)?.length,
//     //   token,
//     //   data: {
//     //     data: userDetails,
//     //   },
//     // });
//   }
// );
