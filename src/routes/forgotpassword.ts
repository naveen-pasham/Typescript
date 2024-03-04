const path = require('path');

import {Router} from 'express';

const forgotpasswordController = require('../controllers/forgotpassword');

const router = Router();
router.post('/forgotpassword', forgotpasswordController.forgotpassword);
router.get('/resetpassword/:resetpasswordId', forgotpasswordController.resetpassword);
router.get('/updatepassword/:resetpasswordId', forgotpasswordController.updatepassword);


export default router;
