const express= require('express');

const router = express.Router();

const SignUpController = require('../controller/SignController')
const authentication = require('../Middleware/auth')

router.post('/user/signup',SignUpController.PostSignup)

router.post('/login/loginuser',SignUpController.postlogin)

router.post('/user/message',authentication.authenticate, SignUpController.postmessage)

router.get('/user/getmessage',authentication.authenticate, SignUpController.getmessages)

module.exports = router