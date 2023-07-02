import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';

import { router as productRoutes } from './routes/productRouter';
import { router as authRoutes } from './routes/authRouter';
import { router as userRoutes } from './routes/userRoutes';
import { router as cartRoutes } from './routes/cartRoutes';

import { AppError } from './utils/AppError';
import { globalErrorHandler } from './controllers/errorController';
import { initializeGoogleStartergy } from './services/googleStratergy';
import { initializeJwtStratergy } from './services/jwtStratergy';

// Intilainzing express
const app = express();
app.use(cookieParser());
// Enabling cors
app.use(
  cors({
    origin: process.env.CLIENT_SIDE_URI!,
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
  })
);

// Enabling passportjs for auth
app.use(passport.initialize());
initializeGoogleStartergy();
initializeJwtStratergy();

// Morgan for loggers
app.use(morgan('dev'));
app.use(express.json());

// Main Routes for all features
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/cart', cartRoutes);

// Non defined Route
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling route
app.use(globalErrorHandler);

// Setting up server
const serverPort = process.env.SERVER_PORT || 8080;
app.listen(serverPort, () =>
  console.log(`Server is listening on Port - ${serverPort}`)
);
