 const jwt = require('jsonwebtoken');
 const signup = require('../Model/SignUpModel')
const bcrypt = require('bcrypt')

function generateExcessToken(id,name){
    return jwt.sign({id:id,name:name},'mysecretcode')
    
  }

exports.PostSignup = async(req,res,next)=>{
      console.log("reach backend")
    try{
        const Name = req.body.Name;
        const Email = req.body.Email;
        const Phone = req.body.Phone;
        const Password = req.body.Password;

    console.log(Name,Email,Phone,Password)

    bcrypt.hash(Password, 10, async (err, hash) => {
        if (err) {
            console.log("err in password hashing");
            return res.status(500).json({ error: "Password hashing failed" });
        }
        const alredyuser = await signup.findAll({where:{Email:Email}})
        if(alredyuser.length>0){
            console.log(alredyuser)
            res.status(200).json({message:"user alredy present"})
        }else{
        const userinfo = await signup.create({ Name: Name, Email: Email, Phone: Phone, Password: hash });
        console.log("response1");
        res.status(201).json({ data: userinfo, message: "done post signup" });
        console.log("response2");
        }
    });

    }catch(err){
        console.log("errors are:",err.message)
    }
}

exports.postlogin = async(req,res,next)=>{
    try{
    const Email= req.body.Email;
    const Password = req.body.Password
    const userpresent = await signup.findAll({where:{Email:Email}})
      if(userpresent.length>0){
        bcrypt.compare(Password,userpresent[0].Password,(err,result)=>{
            if(err){
            return res.status(500).json({message:"problem comparing password"})
            }
            if(result == true){
           return res.status(201).json({message:"user is present",token:generateExcessToken(userpresent[0].id,userpresent[0].Name)})
            }else{
           return res.status(400).json({message:"password is incorrect"})    
            }
          })

          }else{
           return res.status(401).json({message:'User Not Found'})
      }
    }catch(err){
        console.log(err)
    }
}

