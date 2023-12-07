const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const ArchieveChat=sequelize.define('archievechat',{
    id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    messageContent:{
        type:Sequelize.TEXT,
        allowNull: false
    },
    userName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    userId:{
        type:Sequelize.STRING,
        allowNull:false
    },
})

module.exports = ArchieveChat