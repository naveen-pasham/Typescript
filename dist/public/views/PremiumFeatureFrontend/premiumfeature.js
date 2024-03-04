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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const page = 1;
const itemsPerPage = localStorage.getItem('itemsPerPage');
const token = localStorage.getItem('token');
function showTab(tabId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (tabId === 'monthly') {
            const expense = yield axios_1.default.get(`http://localhost:3000/userexpense/getexpenses?page=${page}&itemsPerPage=${itemsPerPage}`, { headers: { "Authorization": token } });
            // console.log(expense)
            for (let i = 0; i < expense.data.expense.length; i++) {
                let result = expense.data.expense[i];
                let amounttype = result.amounttype;
                let date = new Date(result.createdAt);
                let currentdate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                if (amounttype === 'Income') {
                    let tableBody = document.getElementById('expensemonthly');
                    tableBody = tableBody.getElementsByTagName('tbody')[0];
                    let row = '<tr><td>' + currentdate + '</td><td>' + result.description + '</td><td>' + result.category + '</td><td>' + result.amount + '</td><td>' + '' + '</td></tr>';
                    tableBody.insertAdjacentHTML('beforeend', row);
                }
                else {
                    let tableBody = document.getElementById('expensemonthly');
                    tableBody = tableBody.getElementsByTagName('tbody')[0];
                    let row = '<tr><td>' + currentdate + '</td><td>' + result.description + '</td><td>' + result.category + '</td><td>' + '' + '</td><td>' + result.amount + '</td></tr>';
                    tableBody.insertAdjacentHTML('beforeend', row);
                }
            }
        }
        if (tabId === 'yearly') {
            const expense = yield axios_1.default.get(`http://localhost:3000/userexpense/getexpenses?page=${page}&itemsPerPage=${itemsPerPage}`, { headers: { "Authorization": token } });
            // console.log(expense)
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            let result = expense.data.user;
            let date = new Date(result.updatedAt);
            let currentmonth = months[date.getMonth()];
            let tableBody = document.getElementById('expenseyearly');
            tableBody = tableBody.getElementsByTagName('tbody')[0];
            let row = `<tr><td>${currentmonth}</td><td>${result.Income}</td><td>${result.Expenses}</td><td>${result.Income - result.Expenses}</td></tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        }
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach((tabContent) => {
            tabContent.classList.remove('active');
        });
        const selectedTab = document.getElementById(tabId);
        selectedTab.classList.add('active');
    });
}
window.addEventListener('DOMContentLoaded', () => {
    showTab('daily');
});
