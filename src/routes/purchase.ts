import {Router} from 'express';

const purchaseController = require('../controllers/purchase');

const authenticatemiddleware = require('../middleware/auth');

const router = Router();

router.get('/premiummembership', authenticatemiddleware.authenticate,purchaseController.purchasepremium);

router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus)

export default router;