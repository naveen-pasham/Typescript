const jwt = require('jsonwebtoken');
const User = require('../models/signup');

const authenticate = (req:any, res:any, next:Function) => {

    try {
        const token = req.header('authorization');
        const user = jwt.verify(token, '576788yuihjhdjhoijoidjoj6787898090ihjikjlkkllklmlml');
        User.findByPk(user.userId).then((user:object) => {
    
            req.user = user;
            next();
        })

      } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
        // err
      }

}

module.exports = {
    authenticate
}