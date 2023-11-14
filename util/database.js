const Sequelize = require('sequelize')

const sequelize = new Sequelize('group-chat-app','root', 'Vikas1998',{
    dialect:'mysql',
    host: 'localhost'
})

module.exports = sequelize