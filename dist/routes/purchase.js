"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchaseController = require('../controllers/purchase');
const authenticatemiddleware = require('../middleware/auth');
const router = (0, express_1.Router)();
router.get('/premiummembership', authenticatemiddleware.authenticate, purchaseController.purchasepremium);
router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus);
exports.default = router;
