import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

const sendErrorDev = (err: AppError, res: Response) => {
  console.log('❌ Error : ', err);

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.log('❌ Error : ', err);
  res.status(500).json({
    status: 'Error',
    message: 'Something went wrong!',
  });
};

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else sendErrorProd(err, res);
};
