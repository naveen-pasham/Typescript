"use strict";
const jwt = require('jsonwebtoken');
const User = require('../models/signup');
const authenticate = (req, res, next) => {
    try {
        const token = req.header('authorization');
        const user = jwt.verify(token, '576788yuihjhdjhoijoidjoj6787898090ihjikjlkkllklmlml');
        User.findByPk(user.userId).then((user) => {
            req.user = user;
            next();
        });
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ success: false });
        // err
    }
};
module.exports = {
    authenticate
};
