import { Request, Response, NextFunction } from 'express';
import { catchAsyncError } from '../utils/catchAsyncError';
import db from '../db';
import { RowDataPacket } from 'mysql2/promise';
import { cartQuery } from '../query/cartQuery';
import { AppError } from '../utils/AppError';
import { UserWithIdInterface } from '../model/customUserReq';

export const getCartItems = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    // validating userId
    // :TODO(q) - Cond where only logged in user id and userId from params match so only logged in user can see its only cart
    const { id: userId } = req.user as UserWithIdInterface;
    if (!userId || typeof userId !== 'string')
      throw new AppError('Unauthorized request', 401);

    // feching cart items per userId
    const [rows] = await db.query<RowDataPacket[]>(
      cartQuery.getItemsFromCart,
      userId
    );

    // sending the items
    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: {
        data: rows,
      },
    });
  }
);

export const addItemToCart = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // validating userId
    // :TODO(q) - Cond where only logged in user id and userId from params match so only logged in user can see its only cart
    const { id: userId } = req.user as UserWithIdInterface;
    if (!userId || typeof userId !== 'string')
      throw new AppError('Unauthorized request', 401);

    // validating the req body
    // :TODO(p) - Decide how much quantity can be booked in one time
    const { productId, quantity, size } = req.body;
    if (
      !productId ||
      typeof productId !== 'string' ||
      !quantity ||
      quantity <= 0 ||
      typeof quantity !== 'number' ||
      !size ||
      typeof size !== 'string'
    )
      throw new AppError('Please provide valid Cart Item details', 400);

    if (quantity > 5)
      throw new AppError('More quantity cannot be added for this item', 400);

    if (
      size !== 'S' &&
      size !== 'M' &&
      size !== 'L' &&
      size !== 'XL' &&
      size !== 'XXL'
    )
      throw new AppError('This type of size is not available', 400);

    //checking if product is alredy added in cart (with some other variations)
    const [getCartProduct] = await db.query<RowDataPacket[]>(
      cartQuery.getItemFromCartUsingProductId,
      [userId, productId]
    );

    if (getCartProduct.length === 0) {
      // inserting product in the cart table if no product available
      const [_] = await db.query<RowDataPacket[]>(cartQuery.addItemToCart, [
        userId,
        productId,
      ]);
    }

    // inserting product variations in the cart
    const [rows] = await db.query<RowDataPacket[]>(
      cartQuery.addItemVariationToCart,
      [userId, productId, size, quantity]
    );

    // sending the items
    res.status(201).json({
      status: 'success',
    });
  }
);

// updating the product quantity
export const updateItemInCart = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // validating userId
    // :TODO(q) - Cond where only logged in user id and userId from params match so only logged in user can see its only cart
    const { id: userId } = req.user as UserWithIdInterface;
    if (!userId || typeof userId !== 'string')
      throw new AppError('Unauthorized request', 401);

    // validating the req body
    // :TODO(p) - Decide how much quantity can be booked in one time
    const { productId, quantity, size } = req.body;
    if (
      !productId ||
      typeof productId !== 'string' ||
      !quantity ||
      quantity <= 0 ||
      typeof quantity !== 'number'
    )
      throw new AppError('Please provide valid Cart Item details', 400);

    if (quantity > 5)
      throw new AppError('More quantity cannot be added for this item', 400);

    if (
      size !== 'S' &&
      size !== 'M' &&
      size !== 'L' &&
      size !== 'XL' &&
      size !== 'XXL'
    )
      throw new AppError('Please provide valid Cart Item details', 400);

    /*
    // checking product exists or not
    const getCartProductPromise = db.query<RowDataPacket[]>(
      cartQuery.getItemFromCartUsingProductId,
      [userId, productId]
    );

    // checking whether its variation exist or not
    const getCartProductVariationPromise = db.query<RowDataPacket[]>(
      cartQuery.getItemVariationFromCart,
      [userId, productId, size]
    );

    // fetching promises in parallel
    const promises = [getCartProductPromise, getCartProductVariationPromise];
    const result = await Promise.all(promises);
    */

    // updating product quantity in the cart table
    const [rows] = await db.query<RowDataPacket[]>(cartQuery.updateItemInCart, [
      quantity,
      userId,
      productId,
      size,
    ]);

    // sending the items
    res.status(200).json({
      status: 'success',
    });
  }
);

// Controller for completely deleting the item from the cart
export const deleteItemFromCart = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // validating userId
    // :TODO(q) - Cond where only logged in user id and userId from params match so only logged in user can see its only cart
    const { id: userId } = req.user as UserWithIdInterface;
    if (!userId || typeof userId !== 'string')
      throw new AppError('Unauthorized request', 401);

    // validating the req body
    const { productId, size } = req.body;
    if (!productId || typeof productId !== 'string')
      throw new AppError('Please provide valid Cart Item details', 400);
    if (
      size !== 'S' &&
      size !== 'M' &&
      size !== 'L' &&
      size !== 'XL' &&
      size !== 'XXL'
    )
      throw new AppError('Please provide valid Cart Item details', 400);

    // deleting product in the cart table
    const [rows] = await db.query<RowDataPacket[]>(
      cartQuery.deleteItemFromCart,
      [userId, productId, size]
    );

    // sending empty reponse
    res.status(204).send();
  }
);
