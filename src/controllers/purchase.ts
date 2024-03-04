
const Razorpay = require('razorpay');
const Order = require('../models/orders')


const purchasepremium =async (req:any, res:any) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
       // console.log(rzp);
        const amount = 2500;

        rzp.orders.create({amount, currency: "INR"}, (err:any, order:any) => {
           
            if(err) {
                throw new Error(err);
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
             //   console.log(order)
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch((err : any) => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}

 const updateTransactionStatus = (req:any, res:any ) => {
    try {
        const { payment_id, order_id,reason} = req.body;
       // console.log(req.body);
        Order.findOne({where : {orderid : order_id}}).then((order:any) => {
            if(reason==='payment_failed'){
                order.update({ paymentid: payment_id, status: 'FAILED'}).then(() => {
                    console.log(order)
                    req.user.update({ispremiumuser: false})
                    return res.status(202).json({sucess: false, message: "Transaction Failed"});
                }).catch((err:any)=> {
                    console.log(err)
                    throw new Error(err);
                });
            
            }else{
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
                req.user.update({ispremiumuser: true})
                return res.status(202).json({sucess: true, message: "Transaction Successful"});
            }).catch((err:any)=> {
                console.log(err)
                throw new Error(err);
            });
        }
           
           
        }
        
        ).catch((err:any) => {
            throw new Error(err);
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })

    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus
}