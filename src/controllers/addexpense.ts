import  path from 'path';
const Expense = require('../models/addexpense');
const filedownload = require('../models/filedownload');
const sequelize = require('../util/database');


const S3services=require('../Services/s3services');

exports.downloadExpenses=async(req:any,res:any)=>{
  try{
    const expenses=await Expense.findAll({where:{userId:req.user.id}});
  // console.log(expenses);
    const stringyfiedExpenses=JSON.stringify(expenses);
    const userId=req.user.id;
    const filename=`Expense${userId}/${new Date()}.txt`;
    const fileUrl= await S3services.uploadToS3(stringyfiedExpenses,filename);
     await filedownload.create({
      fileurl:fileUrl,
    });
    res.status(200).json({fileUrl,success:true})
  }
  catch(err){
    console.log(err);
    res.status(500).json({fileUrl:'',success:false,err:err});
  }
}

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



exports.AddExpense = async(req:any, res:any) => {
  try{
    const t= await sequelize.transaction();
  const amount=req.body.expenseamount;
  const description=req.body.description;
  const category=req.body.category;
  const amounttype=req.body.amounttype;
  const expensdata=await Expense.create({
    amount:amount,
    description:description,
    category:category,
    userId:req.user.id,
    amounttype:amounttype
  },{transaction:t as any});
  if(amounttype==='Income'){
    let expenseamount=parseInt(req.user.Income);
      expenseamount=expenseamount+parseInt(expensdata.amount);
    await req.user.update({Income:expenseamount},{transaction:t});
    await t.commit();
  }else{
    let expenseamount=parseInt(req.user.Expenses);
      expenseamount=expenseamount+parseInt(expensdata.amount);
   await req.user.update({Expenses:expenseamount},{transaction:t});
    await t.commit();
  }
   return  res.json(expensdata);
  }
catch(err){
  await t.rollback();
 res.status(500).json(err);
}

};

exports.getexpenses=(req:any,res:any)=>{
  const page=req.query.page as number || 1;
 // console.log(page)
  const ITEMS_PER_PAGE = req.query.itemsPerPage as number || 10; 
 // console.log(ITEMS_PER_PAGE);
  let totalItems:number;
  Expense.findAll({attributes:['userId',[sequelize.fn('count',sequelize.col('userId')),'nooftimes']],
           group:['userId']}).then((total:Array<any>)=>{
            total.forEach(element => {
            //  console.log(element)
            //  console.log(element.dataValues.nooftimes)
              if(req.user.id===element.userId){
                totalItems=element.dataValues.nooftimes;
              //  console.log(totalItems)
              }
              
            });
    return Expense.findAll({
      offset:(page-1)* ITEMS_PER_PAGE,
      limit:ITEMS_PER_PAGE,
      where:{userId:req.user.id}
    })
  }).then((expenses:Array<any>)=>{
   // console.log(expenses)

    res.json({
      expense:expenses,
      user:req.user,
      currentpage:page,
      hasNextPage:ITEMS_PER_PAGE*page <totalItems,
      nextPage:page+1,
      hasPreviouspage:page>1,
      previousPage:page-1,
      lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
    });
  }).catch((err:any)=>console.log(err))

};

exports.deleteexpense=async (req:any,res:any)=>{
  const t= await sequelize.transaction();
  try{
        const expenseid=req.params.expenseId;
        const expense=await Expense.findOne({where:{id:expenseid}});
        const deletedexpense= await expense.destroy({transaction:t});
        let expenseamount=parseInt(req.user.totalexpenses);
        expenseamount=expenseamount-parseInt(expense.amount);
       await req.user.update({totalexpenses:expenseamount},{transaction:t});
        await t.commit();
        return res.json(deletedexpense);
  }
  catch(err){
    await t.rollback();
   console.log(err)
  }
}


