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
const Sib = require('sib-api-v3-sdk');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../models/signup');
const Forgotpassword = require('../models/forgotpassword');
exports.forgotpassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User.findOne({ where: { email } });
        if (user) {
            const id = uuid.v4();
            user.createForgotpassword({ id, active: true })
                .catch((err) => {
                throw new Error(err);
            });
            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.API_KEY;
            const tranEmailApi = new Sib.TransactionalEmailsApi();
            const sender = {
                email: 'dummy@gmail.com'
            };
            const receivers = [
                {
                    email: 'naveenpashamofficial@gmail.com'
                    // email:req.body.email
                }
            ];
            tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Forgot Password',
                textContent: `Click on below link to reset password`,
                htmlContent: `<a href='http://localhost:3000/password/resetpassword/${id}'>Reset password</a>`
            }).then((response) => console.log(response)).catch((err) => console.log(err));
        }
        else {
            throw new Error('User doesnt exist');
        }
    }
    catch (err) {
        console.error(err);
        return res.json({ message: err, sucess: false });
    }
});
exports.resetpassword = (req, res) => {
    const id = req.params.resetpasswordId;
    Forgotpassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
        if (forgotpasswordrequest) {
            forgotpasswordrequest.update({ active: false });
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                           
                                            console.log('called')
                                        }
                                    </script>
                                   

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
            res.end();
        }
    });
};
exports.updatepassword = (req, res) => {
    try {
        const { newpassword } = req.query;
        console.log(newpassword);
        const { resetpasswordId } = req.params;
        Forgotpassword.findOne({ where: { id: resetpasswordId } }).then((resetpasswordrequest) => {
            User.findOne({ where: { id: resetpasswordrequest.userId } }).then((user) => {
                // console.log('userDetails', user)
                if (user) {
                    //encrypt the password
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function (err, hash) {
                            // Store hash in your password DB.
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({ message: 'Successfuly update the new password' });
                            });
                        });
                    });
                }
                else {
                    return res.status(404).json({ error: 'No user Exists', success: false });
                }
            });
        });
    }
    catch (error) {
        return res.status(403).json({ error, success: false });
    }
};
