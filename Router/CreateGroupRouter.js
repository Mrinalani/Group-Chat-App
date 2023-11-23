const express= require('express');

const router = express.Router();

const creategroupcontroller = require('../controller/CreateGroup.Controller')
const authentication = require('../Middleware/auth')

router.post('/group/createGroup',authentication.authenticate,creategroupcontroller.createGroup)

router.get('/users/getAll',creategroupcontroller.getAllUsers)

router.post('/add/participants',creategroupcontroller.addParticipants)

router.post('/remove/participants',creategroupcontroller.removeParticipants)

router.get('/groups/:groupId/members', creategroupcontroller.getGroupMembers);

router.get('/user/isAdmin/:groupId', authentication.authenticate, creategroupcontroller.userIsAdmin)


module.exports = router