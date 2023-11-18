const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const signupRouter = require('./Router/SignUpRouter')
const ChatAppRouter = require('./Router/chatAppRouter')
const sequelize = require('./util/database')

const User = require('./Model/SignUpModel')
const Message = require('./Model/MessageModel')


const app = express();
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(signupRouter)
app.use(ChatAppRouter)

User.hasMany(Message);
Message.belongsTo(User)


sequelize.sync({})
    .then(() => {
        console.log('Database and tables synced');
        app.listen(3000)
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });