const express= require('express');

const router = express.Router();

const SignUpController = require('../controller/SignController')
const authentication = require('../Middleware/auth')

router.post('/user/signup',SignUpController.PostSignup)

router.post('/login/loginuser',SignUpController.postlogin)

router.post('/user/message',authentication.authenticate, SignUpController.postmessage)

router.get('/user/getmessage',authentication.authenticate, SignUpController.getmessages)

router.put('/user/active/:prodid',SignUpController.updateactive)

router.get('/get/activeusers',SignUpController.getactiveusers)

module.exports = router