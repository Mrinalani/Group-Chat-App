const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const ArchieveGroupChats=sequelize.define('Archievegroupchats',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    Chats:{
        type:Sequelize.TEXT
    },
    userName:{
        type:Sequelize.STRING
    },
    groupId:{
        type:Sequelize.INTEGER
    }
})

module.exports=ArchieveGroupChats