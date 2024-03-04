"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const express_1 = require("express");
const premiumController = require('../controllers/premium');
const router = (0, express_1.Router)();
router.get('/showleaderboard', premiumController.getexpenses);
exports.default = router;
