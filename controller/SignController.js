
const signup = require('../Model/SignUpModel')
const bcrypt = require('bcrypt')

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

