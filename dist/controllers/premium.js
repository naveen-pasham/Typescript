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
const User = require('../models/signup');
const sequelize = require('sequelize');
const db = require('../util/database');
const getexpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /////////    by join table approach => approch 1   /////////
        // const userLeaderBoardDetails=await User.findAll({
        //     attributes:['id','username',[db.fn('sum',db.col('amount')),'total_cost']],
        //     include:[{
        //         model:Expense,
        //         attributes:[]
        //     }],
        //     group:['user.id'],
        //     order:[['total_cost','DESC']]
        // })
        const userLeaderBoardDetails = yield User.findAll({ attributes: ['username', 'Expenses'], order: [['Expenses', 'DESC']] });
        console.log(userLeaderBoardDetails);
        res.status(200).json(userLeaderBoardDetails);
        /// ////////by group by approach  => Aproach 2   /////////
        // const users=await User.findAll({
        //    attributes:['id','username']
        //       });
        //     const userAggregatedExpenses= await Expense.findAll({
        //         attributes:['userId',[db.fn('sum',db.col('amount')),'total_cost']],
        //         group:['userId']
        //     });
        //    console.log(userAggregatedExpenses);
        //     var userLeaderBoardDetails=[];
        //     users.forEach(user => {
        //        // console.log(user)
        //         console.log(userAggregatedExpenses[0])
        //         userLeaderBoardDetails.push({name:user.username,total_cost:userAggregatedExpenses[user.id]})
        //     });
        //     console.log(userLeaderBoardDetails);
        //     userLeaderBoardDetails.sort((a,b)=>b.total_cost-a.total_cost);
        //   res.status(200).json(userLeaderBoardDetails)
        //////////// by optimal use using loops => Aproach 3   ////////////
        // const users= await User.findAll()
        // const expenses=await Expense.findAll()
        // const userAggregatedExpenses={};
        // expenses.forEach((expense) => {
        //     if(userAggregatedExpenses[expense.userId]){
        //         userAggregatedExpenses[expense.userId]=userAggregatedExpenses[expense.userId]+expense.amount
        //     }else{
        //         userAggregatedExpenses[expense.userId]=expense.amount;
        //     }
        // });
        //     var userLeaderBoardDetails=[];
        //     users.forEach(user => {
        //        // console.log(user)
        //         console.log(userAggregatedExpenses[0])
        //         userLeaderBoardDetails.push({name:user.username,total_cost:userAggregatedExpenses[user.id]})
        //     });
        //     console.log(userLeaderBoardDetails);
        //     userLeaderBoardDetails.sort((a,b)=>b.total_cost-a.total_cost);
        // res.status(200).json(userLeaderBoardDetails)
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
module.exports = {
    getexpenses
};
//my own stuff
// exports.getexpenses=(req,res,next)=>{
//     Expense.findAll({
//         attributes: [
//           "userId",
//           [sequelize.fn("SUM", sequelize.col("amount")), "amount"],
//         ],
//         group: "userId",
//       }).then(expense=>{
//             User.findAll().then(user=>{
//                return  res.json({expense,user});
//             }).catch(err=>console.log(err));
//         }).catch(err=>console.log(err))
//     };
