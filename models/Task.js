const {Model, DataTypes} = require('sequelize')
const connection = require('../database/connection')


class Task extends Model{}

  Task.init(
    {
      status: {
        type: DataTypes.ENUM(['Done','Pending']),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      taskId:{
          type: DataTypes.INTEGER,
          autoIncrement:true,
          allowNull:false,
          primaryKey:true
      },
      image:{
        type: DataTypes.TEXT,//needs to be changed
        allowNull:true
      },
    },
    {
      sequelize: connection,
      modelName: 'Task',
    }
  )

  module.exports = Task