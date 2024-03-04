
import  axios  from "axios";

const forgot=document.getElementById('forgot') as HTMLButtonElement
forgot.addEventListener('click',()=>{
    forgotpassword(event);
})


    async function forgotpassword(event:any) {
        try{
        event.preventDefault();

        const email=  document.getElementById('email') as HTMLInputElement;      
        const obj={
            email:email.value
        }
      
         const forgotpassworduserdata=await axios.post('http://localhost:3000/password/forgotpassword',obj);
         console.log(forgotpassworduserdata);
        }
        catch(error){
         console.log(error);
        }
      }
