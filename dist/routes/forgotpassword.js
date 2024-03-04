"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const express_1 = require("express");
const forgotpasswordController = require('../controllers/forgotpassword');
const router = (0, express_1.Router)();
router.post('/forgotpassword', forgotpasswordController.forgotpassword);
router.get('/resetpassword/:resetpasswordId', forgotpasswordController.resetpassword);
router.get('/updatepassword/:resetpasswordId', forgotpasswordController.updatepassword);
exports.default = router;