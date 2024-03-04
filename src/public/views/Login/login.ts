 

import  axios  from "axios";

const login=document.getElementById('login') as HTMLButtonElement;
const forgot=document.getElementById('forgot') as HTMLButtonElement;
const signup=document.getElementById('signup') as HTMLButtonElement;

login.addEventListener('click',()=>{
  user(event);
})

 
 // add user 
 async function user(event:any) {
    try{
    event.preventDefault();
    const email=  document.getElementById('email') as HTMLInputElement;
    const password= document.getElementById('password') as HTMLInputElement;
    const usesrstatus=document.getElementById('userstatus') as HTMLInputElement;
    const obj={
      email:email.value,
      password:password.value
    }
  
     const logindata=await axios.post('http://localhost:3000/user/login',obj);
       usesrstatus.innerText=logindata.data.message;
        if(logindata.data.message==="User Login Sucessfully!!"){
          localStorage.setItem('token', logindata.data.token);
        window.location.href = "../PremiumFeatureFrontend/premiumfeature.html" 
      }
    }
    catch(error:any){
      console.log(error)
      const usesrstatus=document.getElementById('userstatus') as HTMLInputElement;
      usesrstatus.innerText=error.response.data.message;
    }
  }
  signup.addEventListener('click',()=>{
    window.location.href = "../Signup/signup.html" 
  })

  forgot.addEventListener('click',()=>{
    window.location.href = "../ForgotPassword/forgotpassword.html" 
  })