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
const login = document.getElementById('login');
const forgot = document.getElementById('forgot');
const signup = document.getElementById('signup');
login.addEventListener('click', () => {
    user(event);
});
// add user 
function user(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            event.preventDefault();
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const usesrstatus = document.getElementById('userstatus');
            const obj = {
                email: email.value,
                password: password.value
            };
            const logindata = yield axios_1.default.post('http://localhost:3000/user/login', obj);
            usesrstatus.innerText = logindata.data.message;
            if (logindata.data.message === "User Login Sucessfully!!") {
                localStorage.setItem('token', logindata.data.token);
                window.location.href = "../PremiumFeatureFrontend/premiumfeature.html";
            }
        }
        catch (error) {
            console.log(error);
            const usesrstatus = document.getElementById('userstatus');
            usesrstatus.innerText = error.response.data.message;
        }
    });
}
signup.addEventListener('click', () => {
    window.location.href = "../Signup/signup.html";
});
forgot.addEventListener('click', () => {
    window.location.href = "../ForgotPassword/forgotpassword.html";
});
