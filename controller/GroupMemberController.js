const Groups = require('../Model/GroupModel')
const UserGroup = require('../Model/userGroupModel')
const User = require('../Model/SignUpModel')
const Chatting = require('../Model/ChattingModel')
const { Op } = require('sequelize');
const s3Services = require('../services/s3 services')

const Sequelize = require('sequelize') 
const ArchieveGroupChat = require('../Model/ArchieveGroupChats')
const cron = require('node-cron')


cron.schedule('0 0 * * *', async () => {
    console.log('code is running in cron')
    const oneDayAgo = new Date()
    console.log('oneDayAgo', oneDayAgo)
    const currentDay=oneDayAgo.getDate()
    console.log('currentDay', currentDay)
   const setDate =  oneDayAgo.setDate(currentDay-1)
   console.log('setDate', setDate)

    try{
        const oldchat = await Chatting.findAll({ 
            where:{ 
                createdAt: {
                     [Sequelize.Op.lt]: oneDayAgo} 
                    }
                 })
                 console.log('old chats', oldchat)

            for (let chat of oldchat) {
                await ArchieveGroupChat.create({
                    Chats:chat.Chats,
                    userName:chat.userName ,
                    groupId:chat.groupId
                 })

                 await chat.destroy()
             }
           


    }catch (error) {
        console.error(error)
    }
   
})


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

    const data = await Chatting.create({Chats:message,userName:req.user.Name ,groupId:groupId})
    res.status(201).json({message:'success', RetrievedData:data})

    console.log("%%%%%%%%%%%%%%",data)
}

exports.particulargroupchats = async(req,res,next)=>{
    const userName = req.user.Name
    const groupId = req.params.groupId
    const data = await Chatting.findAll({where:{groupId:groupId}})
    console.log("data is", data )
    res.status(201).json({RetrievedData:data})
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

exports.uploadFile=async(req,res)=>{
    try{
        const user=req.user
        const file=req.file
        console.log('>>>>>>>>>>>>>>>>>> file:', file)
        const groupId=req.body.groupId
        console.log('groupid:', groupId)
        const fileName=`chat${user.id}/${new Date()}`
        const fileURL= await s3Services.uploadToS3 (file,fileName) 
         console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>location',fileURL)
       const data = await Chatting.create({Chats:fileURL,userName:req.user.Name ,groupId:groupId})

       res.status(200).json({userName:user.Name,message:fileURL, groupId:groupId} )

       console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>,', data)


    }catch(err){
        console.log(err)
    }
}

    
