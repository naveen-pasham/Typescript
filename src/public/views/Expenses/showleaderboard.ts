import  axios  from "axios";

const showleaderboard=document.getElementById('showleaderboard') as HTMLButtonElement;
showleaderboard.onclick=async function(e){
    e.preventDefault();

    const listexpenses=document.getElementById('listexpenses') as HTMLElement;
    listexpenses.innerText='Leader Board';
    const showexpense= await axios.get('http://localhost:3000/premium/showleaderboard');
    console.log(showexpense)
    showexpense.data.forEach((expense: any) => {
        let ullist =  document.getElementById('listexpenses') as HTMLElement;
        let row = '<li>Name -'+expense.username+'    Total Expense-' + expense.Expenses + '</li>';
        ullist.insertAdjacentHTML('beforeend', row);
    });
        
    }
