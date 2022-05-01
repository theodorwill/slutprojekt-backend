const database = require("../database/connection");

const User = require('./User')
const Message = require('./Message')
const Task = require('./Task')

User.hasMany(Task);
Task.belongsTo(User);

Task.hasMany(Message)
Message.belongsTo(User)

User.hasMany(Message)
Message.belongsTo(User)

async function setup(){
    await database.sync({alter: true})
}

async function seed(){
    await User.bulkCreate([
          {userName:"chocolate"},
          {userName:"banana"},
          {userName:"vanilla"},
          {userName:"butterscotch"},
          {userName:"mango"},
          {userName:"coconut"},
          {userName:"strawberry"},
          {userName:"pistachio"},
          {userName:"mint"},
          {userName:"blueberry"},
          {userName:"saltedcaramel"},
          {userName:"almond"},
          {userName:"coffeeoreo"},
          {userName:"guava"},
          {userName:"pineapple"},
        ])
}

async function start(){
    await setup()
    await seed()
}

start()

module.exports = {User, Message, Task}
