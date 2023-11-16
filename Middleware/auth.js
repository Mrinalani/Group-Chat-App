const jwt = require('jsonwebtoken')
const User = require('../Model/SignUpModel')

const authenticate = async(req,res,next)=>{
    try{
     const token = req.header('Authorization')

     if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token is missing' });
    }

     const user = jwt.verify(token,'mysecretcode')

     User.findByPk(user.id)
     .then((user)=>{
      req.user = user
      next()
     })

    }catch(error){
        console.log(error)
        return res.status(401).json({success:false})
    }
}

module.exports = {
    authenticate
}