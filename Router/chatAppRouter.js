const express= require('express');

const router = express.Router();

const ChatAppController = require('../controller/ChatAppController')
const authentication = require('../Middleware/auth')

router.post('/user/message',authentication.authenticate, ChatAppController.postmessage)

router.get('/server/messages',authentication.authenticate, ChatAppController.getmessages)

router.put('/user/active/:prodid',ChatAppController.updateactive)

router.get('/get/activeusers',ChatAppController.getactiveusers)

router.put('/update',authentication.authenticate, ChatAppController.update)

module.exports = router