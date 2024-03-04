const path = require('path');

import {Router} from 'express';
const userauthentication = require('../middleware/auth');


const expenseController = require('../controllers/addexpense');

const router = Router();

router.post('/addexpense',userauthentication.authenticate, expenseController.AddExpense);
router.get('/getexpenses', userauthentication.authenticate , expenseController.getexpenses);
router.get('/deleteexpense/:expenseId',userauthentication.authenticate , expenseController.deleteexpense);


export default router;
