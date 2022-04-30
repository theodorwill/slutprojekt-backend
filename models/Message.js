const {Model, DataTypes} = require('sequelize')
const connection = require('../database/connection')


class Message extends Model{}

  Message.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      messageId:{
          type: DataTypes.INTEGER,
          autoIncrement:true,
          allowNull:false,
          primaryKey:true
      },
      image:{
          type: DataTypes.TEXT//needs to be changed
      },
      author:{
          type:DataTypes.INTEGER,
          allowNull:false
      },

    },
    {
      sequelize: connection,
      modelName: 'Message',
    }
  )

  module.exports = Message