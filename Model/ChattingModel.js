const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const Chatting=sequelize.define('Chatting',{
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
    }
})

module.exports=Chatting