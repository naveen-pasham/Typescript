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
const signup = document.getElementById('signup');
signup.addEventListener('click', () => {
    adduser(event);
});
// add user 
function adduser(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            event.preventDefault();
            const name = yield document.getElementById('username');
            const email = yield document.getElementById('email');
            const password = yield document.getElementById('password');
            const usesrstatus = yield document.getElementById('userstatus');
            const obj = {
                name: name.value,
                email: email.value,
                password: password.value
            };
            const userdata = yield axios_1.default.get(`http://localhost:3000/user/getusers/${email}`);
            if (userdata.data === null) {
                const registerdata = yield axios_1.default.post('http://localhost:3000/user/signup', obj);
                usesrstatus.innerText = registerdata.data.message;
                if (registerdata.data.message === 'Succesfully Created New User') {
                    window.location.href = "../Login/login.html";
                }
            }
            else {
                usesrstatus.innerText = 'User already exists';
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
