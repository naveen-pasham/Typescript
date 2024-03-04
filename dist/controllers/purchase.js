"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Razorpay = require('razorpay');
const Order = require('../models/orders');
const purchasepremium = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        // console.log(rzp);
        const amount = 2500;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(err);
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(() => {
                //   console.log(order)
                return res.status(201).json({ order, key_id: rzp.key_id });
            }).catch((err) => {
                throw new Error(err);
            });
        });
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err });
    }
});
const updateTransactionStatus = (req, res) => {
    try {
        const { payment_id, order_id, reason } = req.body;
        // console.log(req.body);
        Order.findOne({ where: { orderid: order_id } }).then((order) => {
            if (reason === 'payment_failed') {
                order.update({ paymentid: payment_id, status: 'FAILED' }).then(() => {
                    console.log(order);
                    req.user.update({ ispremiumuser: false });
                    return res.status(202).json({ sucess: false, message: "Transaction Failed" });
                }).catch((err) => {
                    console.log(err);
                    throw new Error(err);
                });
            }
            else {
                order.update({ paymentid: payment_id, status: 'SUCCESSFUL' }).then(() => {
                    req.user.update({ ispremiumuser: true });
                    return res.status(202).json({ sucess: true, message: "Transaction Successful" });
                }).catch((err) => {
                    console.log(err);
                    throw new Error(err);
                });
            }
        }).catch((err) => {
            throw new Error(err);
        });
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' });
    }
};
module.exports = {
    purchasepremium,
    updateTransactionStatus
};