import { Request, Response, NextFunction } from 'express';
import { catchAsyncError } from '../utils/catchAsyncError';
import db from '../db';
import { themeQuery } from '../query/themeQuery';
import { RowDataPacket } from 'mysql2';

export const getAllThemes = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get a connection from the pool and fetching the final query
    const [rows] = await db.query<RowDataPacket[]>(themeQuery.getAllThemes);

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
