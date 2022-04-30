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
          {flavorName:"chocolate"},
          {flavorName:"banana"},
          {flavorName:"vanilla"},
          {flavorName:"butterscotch"},
          {flavorName:"mango"},
          {flavorName:"coconut"},
          {flavorName:"strawberry"},
          {flavorName:"pistachio"},
          {flavorName:"mint"},
          {flavorName:"blueberry"},
          {flavorName:"saltedcaramel"},
          {flavorName:"almond"},
          {flavorName:"coffeeoreo"},
          {flavorName:"guava"},
          {flavorName:"pineapple"},
        ])
}

async function start(){
    await setup()
    await seed()
}

start()

module.exports = {User, Flavor}
