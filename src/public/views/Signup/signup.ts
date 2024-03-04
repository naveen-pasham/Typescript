import  axios  from "axios";


const signup=document.getElementById('signup') as HTMLButtonElement;

 signup.addEventListener('click',()=>{
  adduser(event);
})
 
 // add user 
 async function adduser(event:any) {
    try{
    event.preventDefault();
    const name= await document.getElementById('username') as HTMLInputElement;
    const email= await document.getElementById('email') as HTMLInputElement;
    const password=await document.getElementById('password') as HTMLInputElement;
    const usesrstatus=await document.getElementById('userstatus') as HTMLElement;
    const obj={
      name:name.value,
      email:email.value,
      password:password.value
    }
   const userdata=await axios.get(`http://localhost:3000/user/getusers/${email}`);
   if(userdata.data===null){
      const registerdata=await axios.post('http://localhost:3000/user/signup',obj)
      usesrstatus.innerText=registerdata.data.message;
      if(registerdata.data.message==='Succesfully Created New User'){
        window.location.href = "../Login/login.html" 
      }
   }else{
    usesrstatus.innerText='User already exists'
   }

    }
    catch(error){
      console.log(error);
    }
  }