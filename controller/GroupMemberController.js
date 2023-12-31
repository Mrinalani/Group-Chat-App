const Groups = require('../Model/GroupModel')
const UserGroup = require('../Model/userGroupModel')
const User = require('../Model/SignUpModel')
const Chatting = require('../Model/ChattingModel')
const { Op } = require('sequelize');


exports.AllMembers = async(req,res,next)=>{
    try {
        const userId = req.user.id
            const groups = await Groups.findAll({
                include: [{
                    model: User,
                    where: { id: userId }
                }]
            });

        console.log("!!!!!!!!!!!!!", groups)

        res.status(200).json({ Members: groups });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.IsGroupMember = async(req,res,next)=>{
    try{
    const groupId = req.params.groupId;
    const userId = req.user.id
    console.log("groupId .userId", groupId,userId)
    const userGroup = await UserGroup.findOne({
        where: {
            signupId: userId,
            groupId: groupId,
        },
    });

    console.log("checking user group",userGroup)

    if (userGroup) {
       const groupMembers = await User.findAll({
        include: [{
            model:Groups,
            where: {id:groupId}
        }]
       })
       console.log("checking members", groupMembers)
        res.status(200).json({ isMember: true, groupMembers: groupMembers});
    } else {
        res.status(200).json({ isAdmin: false });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
}

exports.postGroupChats = async(req,res,next)=>{
    let message = req.body.message;
    const groupId = req.body.groupId
    message = `${req.user.Name}: ${message}`

    const data = await Chatting.create({Chats:message, groupId:groupId})
    res.status(201).json({message:'success', RetrievedData:data})
}

exports.particulargroupchats = async(req,res,next)=>{
    const userName = req.user.Name
    const groupId = req.params.groupId
    const data = await Chatting.findAll({where:{groupId:groupId}})
    console.log("data is", data )
    res.status(201).json({RetrievedData:data, Name:userName})
}

exports.getGroupMessages = async(req,res,next)=>{
    try{
        console.log("under getgroupmessages")
        const groupId = req.params.groupId;
        const { lastMessageId } = req.query;
        console.log(groupId, lastMessageId)

        const newMessages = await Chatting.findAll({
            where: {
                id: {
                    [Op.gt]: lastMessageId,
                },
            },
        });
        console.log('newMessage:', newMessages);

        res.json({ message: newMessages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.isAdmin = async(req,res,next)=>{
    console.log("under is admin controller")
    const groupId = req.params.groupId
    const signupId = req.user.id

    const admin = await UserGroup.findOne({where:{
        signupId: req.user.id,
        groupId: groupId,
        isAdmin: 1
    }})
     console.log('isAdmin',admin, signupId,groupId)
    if(admin){
        await Groups.destroy({
            where: {
                id: groupId
            }
        });

        res.status(201).json({Admin:true})
    }
    else{
        res.status(201).json({Admin:false})
    }
}

    
