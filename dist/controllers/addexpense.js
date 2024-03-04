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
const Expense = require('../models/addexpense');
const filedownload = require('../models/filedownload');
const sequelize = require('../util/database');
const S3services = require('../Services/s3services');
exports.downloadExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield Expense.findAll({ where: { userId: req.user.id } });
        // console.log(expenses);
        const stringyfiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileUrl = yield S3services.uploadToS3(stringyfiedExpenses, filename);
        yield filedownload.create({
            fileurl: fileUrl,
        });
        res.status(200).json({ fileUrl, success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ fileUrl: '', success: false, err: err });
    }
});
// function show(expense){
//   for(let i=0;i<expense.length;i++){
//     let result=expense[i];
//     let amounttype=result.amounttype;
//     let date=new Date(result.createdAt);
//     let currentdate=`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
//     if(amounttype==='Income'){
//       let tableBody =  document.getElementById('expensemonthly').getElementsByTagName('tbody')[0];
//       let row =  '<tr><td>'+currentdate+'</td><td>' + result.description + '</td><td>' + result.category + '</td><td>' + result.amount + '</td><td>' +''+ '</td></tr>';
//       tableBody.insertAdjacentHTML('beforeend', row); 
//     }else{
//       let tableBody =  document.getElementById('expensemonthly').getElementsByTagName('tbody')[0];
//       let row =  '<tr><td>'+currentdate+'</td><td>' + result.description + '</td><td>' + result.category + '</td><td>' +''+ '</td><td>' + result.amount + '</td></tr>';
//       tableBody.insertAdjacentHTML('beforeend', row); 
//     }
//   }
// }
exports.AddExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const t = yield sequelize.transaction();
        const amount = req.body.expenseamount;
        const description = req.body.description;
        const category = req.body.category;
        const amounttype = req.body.amounttype;
        const expensdata = yield Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id,
            amounttype: amounttype
        }, { transaction: t });
        if (amounttype === 'Income') {
            let expenseamount = parseInt(req.user.Income);
            expenseamount = expenseamount + parseInt(expensdata.amount);
            yield req.user.update({ Income: expenseamount }, { transaction: t });
            yield t.commit();
        }
        else {
            let expenseamount = parseInt(req.user.Expenses);
            expenseamount = expenseamount + parseInt(expensdata.amount);
            yield req.user.update({ Expenses: expenseamount }, { transaction: t });
            yield t.commit();
        }
        return res.json(expensdata);
    }
    catch (err) {
        yield t.rollback();
        res.status(500).json(err);
    }
});
exports.getexpenses = (req, res) => {
    const page = req.query.page || 1;
    // console.log(page)
    const ITEMS_PER_PAGE = req.query.itemsPerPage || 10;
    // console.log(ITEMS_PER_PAGE);
    let totalItems;
    Expense.findAll({ attributes: ['userId', [sequelize.fn('count', sequelize.col('userId')), 'nooftimes']],
        group: ['userId'] }).then((total) => {
        total.forEach(element => {
            //  console.log(element)
            //  console.log(element.dataValues.nooftimes)
            if (req.user.id === element.userId) {
                totalItems = element.dataValues.nooftimes;
                //  console.log(totalItems)
            }
        });
        return Expense.findAll({
            offset: (page - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
            where: { userId: req.user.id }
        });
    }).then((expenses) => {
        // console.log(expenses)
        res.json({
            expense: expenses,
            user: req.user,
            currentpage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPreviouspage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    }).catch((err) => console.log(err));
};
exports.deleteexpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield sequelize.transaction();
    try {
        const expenseid = req.params.expenseId;
        const expense = yield Expense.findOne({ where: { id: expenseid } });
        const deletedexpense = yield expense.destroy({ transaction: t });
        let expenseamount = parseInt(req.user.totalexpenses);
        expenseamount = expenseamount - parseInt(expense.amount);
        yield req.user.update({ totalexpenses: expenseamount }, { transaction: t });
        yield t.commit();
        return res.json(deletedexpense);
    }
    catch (err) {
        yield t.rollback();
        console.log(err);
    }
});
