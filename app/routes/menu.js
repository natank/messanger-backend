import express from 'express';
import { getMenu } from '../BL/menu';
const router = express.Router();

router.get('/', getMenu);

export default router;
