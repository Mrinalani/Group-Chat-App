const express= require('express');
const multer=require('multer')
const storage=multer.memoryStorage()
const upload = multer({ storage: storage }); 


const router = express.Router();

const groupMemberController = require('../controller/GroupMemberController')

const authentication = require('../Middleware/auth')

router.get('/group/AllMembers',authentication.authenticate,groupMemberController.AllMembers)

router.get('/Group/IsMember/:groupId',authentication.authenticate, groupMemberController.IsGroupMember)

router.post('/group/chats',authentication.authenticate, groupMemberController.postGroupChats)

router.get('/particularGroup/chats/:groupId',authentication.authenticate ,groupMemberController.particulargroupchats)

router.get('/server/Groupmessages/:groupId',authentication.authenticate, groupMemberController.getGroupMessages)

router.get('/check/isAdmin/:groupId',authentication.authenticate,groupMemberController.isAdmin)

router.post('/groupchat/add-file',upload.single('file'),authentication.authenticate, groupMemberController.uploadFile)

module.exports = router