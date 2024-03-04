import  axios  from "axios";

const page=1;
const itemsPerPage=localStorage.getItem('itemsPerPage');
const token=localStorage.getItem('token');

async function showTab(tabId:string) {
    if(tabId==='monthly'){
     
          const expense= await axios.get(`http://localhost:3000/userexpense/getexpenses?page=${page}&itemsPerPage=${itemsPerPage}`,{ headers: { "Authorization": token } })
         // console.log(expense)
          for(let i=0;i<expense.data.expense.length;i++){
            let result=expense.data.expense[i];
            let amounttype=result.amounttype;
            let date=new Date(result.createdAt);
            let currentdate=`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
            if(amounttype==='Income'){
              let tableBody =  document.getElementById('expensemonthly') as HTMLTableSectionElement;
              tableBody=tableBody.getElementsByTagName('tbody')[0];
              let row =  '<tr><td>'+currentdate+'</td><td>' + result.description + '</td><td>' + result.category + '</td><td>' + result.amount + '</td><td>' +''+ '</td></tr>';
              tableBody.insertAdjacentHTML('beforeend', row); 
            }else{
              let tableBody =  document.getElementById('expensemonthly') as HTMLTableSectionElement;
              tableBody=tableBody.getElementsByTagName('tbody')[0];
              let row =  '<tr><td>'+currentdate+'</td><td>' + result.description + '</td><td>' + result.category + '</td><td>' +''+ '</td><td>' + result.amount + '</td></tr>';
              tableBody.insertAdjacentHTML('beforeend', row); 
            }
          }

    }
    if(tabId==='yearly'){
        const expense= await axios.get(`http://localhost:3000/userexpense/getexpenses?page=${page}&itemsPerPage=${itemsPerPage}`,{ headers: { "Authorization": token } })
         // console.log(expense)
          let months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            let result=expense.data.user;
            let date=new Date(result.updatedAt);
            let currentmonth=months[date.getMonth()];
            let tableBody =  document.getElementById('expenseyearly') as HTMLTableSectionElement;
            tableBody=tableBody.getElementsByTagName('tbody')[0];
              let row =  `<tr><td>${currentmonth}</td><td>${result.Income}</td><td>${result.Expenses}</td><td>${result.Income-result.Expenses}</td></tr>`;
              tableBody.insertAdjacentHTML('beforeend', row);
    }

    const tabContents =  document.querySelectorAll('.tab-content');
    tabContents.forEach((tabContent) => {
      tabContent.classList.remove('active');
    });

   
    const selectedTab = document.getElementById(tabId) as HTMLElement;
    selectedTab.classList.add('active');

  }
  
  window.addEventListener('DOMContentLoaded',()=>{
    showTab('daily')
  })
