import express from 'express';
import { getAllThemes } from '../controllers/themeController';

export const router = express.Router();

// getting all the themes
router.route('/').get(getAllThemes);
