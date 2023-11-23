const User = require('../Model/SignUpModel');
const UserGroup = require('../Model/userGroupModel');
const Group = require('../Model/GroupModel')
const { Op } = require('sequelize');

exports.createGroup = async (req, res) => {
    try {
        const user = req.user;
        const groupName = req.body.groupName;

        const group = await Group.create({
            groupName: groupName,
            createdBy: user.Name,
        });

        await UserGroup.create({
            signupId: user.id,
            groupId: group.id,
            isAdmin: true,
        });

        res.status(200).json({
            status: true,
            message: `Group ${groupName} Created Successfully`,
            groupId: group.id,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

exports.getAllUsers = async(req,res,next)=>{
    try {
        const participants = await User.findAll({
            attributes: ['id', 'Name'],
        });
         console.log("participants =",participants)
        res.status(200).json({ participants });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}

exports.addParticipants = async (req, res, next) => {
    try {
        const { userIds, groupId } = req.body;

        if (!userIds || !groupId) {
            return res.status(400).json({ error: 'UserIds and groupId are required.' });
        }
           console.log("userIds=",userIds)
        const userIdsArray = Array.isArray(userIds) ? userIds : [userIds];
         console.log("userIdsArray=", userIdsArray)
        const userGroupData = userIdsArray.map(userId => ({
            signupId: userId,
            groupId: groupId,
        }));
        console.log("userGroupData=", userGroupData)

        const existingUserGroups = await UserGroup.findAll({
            where: {
                signupId: userIdsArray,
                groupId: groupId,
            },
        });
        console.log("existingUserGroups=", existingUserGroups)

        const existingUserIds = existingUserGroups.map(userGroup => userGroup.signupId);
        console.log("existingUserIds=", existingUserIds)

         
        const newUserGroupData = userGroupData.filter(userGroup => !existingUserIds.includes(Number(userGroup.signupId)));
        console.log("newUserGroupData=", newUserGroupData)


        if (newUserGroupData.length > 0) {
           const createditems = await UserGroup.bulkCreate(newUserGroupData);
           console.log("createditems=", createditems)

        }
        

        res.status(200).json({ status: true, message: 'Participants added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

exports.removeParticipants = async(req,res,next)=>{
    
try {
    const { userIds, groupId } = req.body;

    await UserGroup.destroy({
        where: {
            signupId: {
                [Op.in]: userIds,
            },
            groupId: groupId,
        },
    });

    res.status(200).json({ success: true, message: 'Participants removed successfully' });
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}

}

exports.getGroupMembers = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const groupMembers = await User.findAll({
            include: [{
                model: Group,
                where: { id: groupId }
            }]
        });

        const membersData = groupMembers.map(member => ({
            id: member.id,
            name: member.Name, 
        }));

        res.status(200).json(membersData);
    } catch (error) {
        console.error('Error fetching group members:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.userIsAdmin = async (req,res,next)=>{
    try {
        const userId = req.user.id; 
        const groupId = req.params.groupId; 
    
        const isAdmin = await UserGroup.findOne({
          where: {
            signupId: userId,
            groupId: groupId,
            isAdmin: true, 
          },
        });
    
        if (isAdmin) {
          res.status(200).json({ isAdmin: true });
        } else{
          res.status(200).json({ isAdmin: false });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}