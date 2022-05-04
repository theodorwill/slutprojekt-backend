const database = require('../database/connection')
const bcrypt = require('bcryptjs')

const User = require('./User')
const Message = require('./Message')
const Task = require('./Task')

User.hasMany(Task,{foreignKey:'clientId'})
Task.belongsTo(User, { targetKey: 'userId', foreignKey: 'clientId' });
Task.belongsTo(User, { targetKey: 'userId', foreignKey: 'workerId' });

Task.hasMany(Message,{foreignKey:'taskId'})
Message.belongsTo(Task, { targetKey: 'taskId', foreignKey: 'taskId' })

User.hasMany(Message,{foreignKey:'authorId'})
Message.belongsTo(User, { targetKey: 'userId', foreignKey: 'authorId' })

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
    {
      userName: 'random',
      email: 'random@gmail.com',
      password: generateHash('aaa'),
      role: 'worker',
    },
  ])

  await Task.bulkCreate([
    {
      status: 'Pending',
      description: 'blablabla',
      workerId: '1',
      clientId: '1',
    },
    {
      status: 'Pending',
      description: 'something',
      workerId: '1',
      clientId: '1',
    },
    {
      status: 'Pending',
      description: 'random',
      workerId: '1',
      clientId: '2',
    },
    {
      status: 'Pending',
      description: 'big problem',
      workerId: '1',
      clientId: '2',
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
