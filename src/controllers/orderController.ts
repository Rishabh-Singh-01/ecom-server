import db from '../db';
import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2/promise';

import { AppError } from '../utils/AppError';
import { catchAsyncError } from '../utils/catchAsyncError';

import { cartQuery } from '../query/cartQuery';
import { orderQuery } from '../query/orderQuery';
import { commonQuery } from '../query/commonQuery';
import { productQuery } from '../query/productQuery';
import { inventoryQuery } from '../query/inventoryQuery';
import { UserWithIdInterface } from '../model/customUserReq';

import { isValidCartItemsDataForOrder } from '../utils/typeGuards';
import { SingleProduct, SingleProductResponse } from '../model/Product';
import {
  CustomErrorMessages,
  ErrorCodes,
  ErrorMessages,
} from '../constants/ServiceConstant';

export const createOrderForUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // checking for userId for auth
    const { id: userId } = req.user as UserWithIdInterface;
    if (!userId || typeof userId !== 'string')
      throw new AppError('Unauthorized request', 401);

    // checking request body integrity
    if (!isValidCartItemsDataForOrder(req.body))
      throw new AppError(ErrorMessages.PROVIDE_VALID_PARAMETERS, 400);

    const { cart_items } = req.body;

    // making queries over transaction to maintiain consistency during order
    // step 1) starting transaction
    await db.query(commonQuery.beginTransaction);
    // step 2) checking whether the inventory has sufficient quantity
    const promises = cart_items.map((cartItem) => {
      return db.query<RowDataPacket[]>(productQuery.getProductUsingId, [
        cartItem.productId,
      ]);
    });
    const result = await Promise.all(promises);
    result.forEach((res: any) => {
      const singleResponse: SingleProduct[] = res.at(0);
      console.log('this is singleProductResponse');
      console.log(singleResponse);
      let cartItemValidProduct = false;
      singleResponse.forEach((prd) => {
        cart_items.forEach((ci) => {
          if (prd.id === ci.productId && ci.size === prd.size_name)
            cartItemValidProduct = true;
          if (ci.quantity > prd.quantity)
            throw new AppError(
              `${ErrorMessages.PROVIDE_VALID_PARAMETERS} ${CustomErrorMessages.QUANTITY_MORE_THAN_STOCK}`,
              ErrorCodes.BAD_REQUEST_ERROR_CODE
            );
        });

        if (!cartItemValidProduct)
          throw new AppError(
            `${ErrorMessages.PROVIDE_VALID_PARAMETERS} ${CustomErrorMessages.SIZE_NOT_AVAILABLE}`,
            ErrorCodes.BAD_REQUEST_ERROR_CODE
          );
      });
    });
    // 3) changing inventory state for every product
    // :TODO(l) -- include category id as well and make this updating concurrent as of now its not concurrent as its giving transaction level stuct lock
    for (let i = 0; i < cart_items.length; i++) {
      const cartItem = cart_items[i];
      const [_] = await db.query<RowDataPacket[]>(
        inventoryQuery.updateInventoryForProduct,
        [cartItem.quantity, cartItem.productId, cartItem.size]
      );
    }
    // // 4) creating order for the customer and fetching the order
    await db.query<RowDataPacket[]>(orderQuery.createOrderForUser, [
      userId,
      false,
    ]);
    // // :TODO(l) -- change the below workaround with better db architecture and query, also make the isolation so that no other commit could changethe latest order (eg: serializble)
    const [orderRes] = await db.query<RowDataPacket[]>(
      orderQuery.getLatestOrderIdForUser,
      [userId]
    );

    if (orderRes.length !== 1) {
      await db.query(commonQuery.rollbackTransaction);
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        ErrorCodes.INTERNAL_SERVER_ERROR_CODE
      );
    }

    if (!orderRes.at(0)!.id)
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        ErrorCodes.INTERNAL_SERVER_ERROR_CODE
      );

    // 5) adding all the products for the order items
    const latestOrderId = orderRes.at(0)!.id;
    for (let i = 0; i < cart_items.length; i++) {
      const cartItem = cart_items[i];
      await db.query<RowDataPacket[]>(orderQuery.createOrderItems, [
        latestOrderId,
        cartItem.productId,
        cartItem.size,
        cartItem.quantity,
      ]);
    }
    // 6) Remove product from cart
    for (let i = 0; i < cart_items.length; i++) {
      const cartItem = cart_items[i];
      await db.query<RowDataPacket[]>(cartQuery.deleteItemFromCart, [
        userId,
        cartItem.productId,
        cartItem.size,
      ]);
    }
    // 7) making the status of order as true;
    await db.query<RowDataPacket[]>(orderQuery.updateOrderStatus, [
      true,
      latestOrderId,
    ]);
    // Commit transaction to save the result
    await db.query(commonQuery.commitTransaction);

    // sending the success response
    // sending the items
    res.status(201).json({
      status: 'success',
    });
  }
);
