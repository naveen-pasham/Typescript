const path = require('path');

import {Router} from 'express';

const premiumController = require('../controllers/premium');

const router = Router();

router.get('/showleaderboard', premiumController.getexpenses);


export default router;
