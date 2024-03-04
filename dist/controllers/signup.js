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
Object.defineProperty(exports, "__esModule", { value: true });
const User = require('../models/signup');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
exports.AddUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        bcrypt.hash(password, 10, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            yield User.create({
                username: username,
                email: email,
                password: hash,
                Income: 0,
                Expenses: 0
            });
            return res.status(201).json({ message: "Succesfully Created New User" });
        }));
    }
    catch (err) {
        res.status(500).json(err);
    }
});
function generateAccessToken(id) {
    return jwt.sign({ userId: id }, '576788yuihjhdjhoijoidjoj6787898090ihjikjlkkllklmlml');
}
exports.getuser = (req, res) => {
    const email = req.params.useremail;
    User.findOne({ where: { email: email } }).then((user) => {
        res.json(user);
    }).catch((err) => console.log(err));
};
exports.checkuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = yield User.findOne({ where: { email: email } });
        if (user) {
            bcrypt.compare(password, user.password, (err, re) => {
                if (!err) {
                    if (re) {
                        return res.json({ success: true, message: "User Login Sucessfully!!", token: generateAccessToken(user.id) });
                    }
                    else {
                        return res.status(401).json({ success: false, message: 'Incorrect Password' });
                    }
                }
            });
        }
        else {
            return res.status(404).json({ message: "User Doesn't Exist" });
        }
    }
    catch (err) {
        console.log(err);
    }
});
