const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Signup = sequelize.define('signup',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,  
        primaryKey: true
    },
    Name: {
        type:Sequelize.STRING,
        allowNull: false  
    },
    Email:{
        type: Sequelize.STRING,
        allowNull: false,  
        unique: true
    },
    Phone: {
        type:Sequelize.STRING,
        allowNull: false,  
    },
    Password:{
        type:Sequelize.TEXT,
        allowNull: false,  
    },
    Active:{
        type:Sequelize.BOOLEAN,
        defaultValue: false
    }
})

module.exports = Signup;
