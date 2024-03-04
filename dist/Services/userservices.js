"use strict";
const Expense = require('../models/addexpense');
const getExpenses = (req, where) => {
    return req.user.getExpenses(where);
};
module.exports = {
    getExpenses
};
