const express= require('express');

const router = express.Router();

const SignUpController = require('../controller/SignController')

router.post('/user/signup',SignUpController.PostSignup)

module.exports = router