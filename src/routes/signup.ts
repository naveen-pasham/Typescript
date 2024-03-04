import  path from 'path';

import {Router} from 'express';

const userController = require('../controllers/signup');
const expenseController = require('../controllers/addexpense');
const authenticatemiddleware = require('../middleware/auth');


const router =Router();

router.post('/signup', userController.AddUser);
router.get('/getusers/:useremail', userController.getuser);
router.post('/login', userController.checkuser);

router.get('/download',authenticatemiddleware.authenticate, expenseController.downloadExpenses);


export default router;
