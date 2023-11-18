const signup = require('../Model/SignUpModel')
const Message = require('../Model/MessageModel')
const { Op } = require('sequelize');

exports.postmessage = async(req,res,next)=>{
    var message = req.body.message
    console.log(message)
    message = `${req.user.Name} : ${message}`

    

    const data = await Message.create({message:message, signupId:req.user.id})
   // console.log(data)

    res.status(201).json({message:'successfull post', data:data, Name:message})
}
exports.getmessages = async (req, res, next) => {
    try {

        console.log("hii inside get server messages")
        const { lastMessageId } = req.query;


        // Use the filter method on the array
        const newMessages = await Message.findAll({
            where: {
                id: {
                    [Op.gt]: lastMessageId,
                },
            },
        });
        console.log('newMessages:', newMessages);

        res.json({ message: newMessages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



exports.updateactive = async(req,res,next)=>{
    console.log("i am in  updataactive")
    const id = req.params.prodid;
    console.log("iiiiiiddddddd",id)

    const user = await signup.findOne({ where: { id: id } });
    console.log(user);

    if (user) {
        const updation = await user.update({ Active: true });
        console.log("####################",updation);
        res.status(201).json({ message: "User updated successfully", data: updation });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

exports.getactiveusers = async (req, res, next) => {
    try {
        const data = await signup.findAll({ where: { Active: true } });
        if (data.length > 0) {
            res.status(201).json({ activeusers: data, success: true });
        } else {
            res.status(404).json({ message: "No active users found", success: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

exports.update = async (req,res,next)=>{
    const data = await signup.findOne({where:{id:req.user.id}})
    const update = await data.update({Active:false})
    res.status(201).json({message:'success'})
}