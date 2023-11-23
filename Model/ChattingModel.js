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
})

module.exports=Chatting