const database = require('../database/connection')
const bcrypt = require('bcryptjs')

const User = require('./User')
const Message = require('./Message')
const Task = require('./Task')

User.hasMany(Task,{foreignKey:'ClientId'})
Task.belongsTo(User, { targetKey: 'userId', foreignKey: 'ClientId' });
Task.belongsTo(User, { targetKey: 'userId', foreignKey: 'WorkerId' });

Task.hasMany(Message,{foreignKey:'TaskId'})
Message.belongsTo(Task, { targetKey: 'taskId', foreignKey: 'TaskId' })

User.hasMany(Message,{foreignKey:'AuthorId'})
Message.belongsTo(User, { targetKey: 'userId', foreignKey: 'AuthorId' })

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
    {
      userName: 'banana',
      email: 'admin@admin.com',
      password: generateHash('abc'),
      role: 'admin',
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
