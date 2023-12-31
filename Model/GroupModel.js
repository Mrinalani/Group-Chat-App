const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const Group=sequelize.define('group',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    groupName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    createdBy:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports=Group