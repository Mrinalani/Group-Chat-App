const express= require('express');

const router = express.Router();

const SignUpController = require('../controller/SignController')
const authentication = require('../Middleware/auth')

router.post('/user/signup',SignUpController.PostSignup)

router.post('/login/loginuser',SignUpController.postlogin)

module.exports = router