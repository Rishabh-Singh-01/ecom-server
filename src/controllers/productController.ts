import db from '../db';
import { RowDataPacket } from 'mysql2';
import { Request, Response, NextFunction } from 'express';

import { catchAsyncError } from '../utils/catchAsyncError';
import { AppError } from '../utils/AppError';
import { productQuery } from '../query/productQuery';
import { APIFeatures } from '../utils/apiFeatures';

export const getProducts = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // const cookies = req.cookies;
    // console.log(cookies);
    const featureQuery = new APIFeatures(req.query, productQuery.getAllProducts)
      .filter()
      .sort()
      .paginate();

    // Get a connection from the pool and fetching the final query
    const [rows] = await db.query<RowDataPacket[]>(
      featureQuery.queryString,
      featureQuery.parameters
    );

    // sending the response
    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: {
        data: rows,
      },
    });
  }
);

export const getProductUsingId = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const [rows] = await db.query<RowDataPacket[]>(
      productQuery.getProductUsingId,
      req.params.id
    );

    // checking if the certain product is found/not
    if (rows.length === 0)
      return next(new AppError(`No tour found with Id ${req.params.id}`, 404));

    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: {
        data: rows,
      },
    });
  }
);
