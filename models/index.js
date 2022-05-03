const database = require('../database/connection')
const bcrypt = require('bcryptjs')

const User = require('./User')
const Message = require('./Message')
const Task = require('./Task')

User.hasMany(Task)
Task.belongsTo(User)

Task.hasMany(Message)
Message.belongsTo(User)

User.hasMany(Message)
Message.belongsTo(User)

async function setup() {
  await database.sync({ force: true })
}

async function seed() {
  await User.bulkCreate([
    {
      userName: 'mango',
      email: 'teha@345.nj',
      password: generateHash('aaa'),
      role: 'client',
    },
  ])

  await Task.bulkCreate([
    {
      status: 'Pending',
      description: 'blablabla',
      workerId: '1',
      clientId: '1',
    },
  ])
}

function generateHash(password) {
  const hash = bcrypt.hashSync(password)
  return hash
}
async function start() {
  await setup()
  await seed()
}

start()

module.exports = { User, Message, Task }
