import express from 'express';
import * as adminController from '../BL/admin';
import { check } from 'express-validator';

var router = express.Router();
// router.get('/', adminController.getDashboard);

module.exports = router;
