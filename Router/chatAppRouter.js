const express= require('express');
const multer=require('multer')
const storage=multer.memoryStorage()
const upload = multer({ storage: storage }); 

const router = express.Router();

const ChatAppController = require('../controller/ChatAppController')
const authentication = require('../Middleware/auth')

router.post('/user/message',authentication.authenticate, ChatAppController.postmessage)

router.get('/server/messages',authentication.authenticate, ChatAppController.getmessages)

router.put('/user/active/:prodid',ChatAppController.updateactive)

router.get('/get/activeusers',ChatAppController.getactiveusers)

router.put('/update',authentication.authenticate, ChatAppController.update)

router.post('/chat/add-file',upload.single('file'),authentication.authenticate, ChatAppController.uploadFile)

module.exports = router