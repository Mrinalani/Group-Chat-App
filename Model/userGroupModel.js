const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const UserGroup=sequelize.define('usergroup',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    isAdmin:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    }
})
module.exports = UserGroup