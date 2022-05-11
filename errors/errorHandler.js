const { IngeByggBaseError } = require('../errors')
const { InvalidCredentials } = require('../errors')
const { BaseError } = require('sequelize')

module.exports = {
  errorHandler(error, req, res, next) {
    console.log('Error handler', error)
    if (error instanceof InvalidCredentials) {
      res.status(error.errorCode).json({ error: error.message })
    }else if(error instanceof IngeByggBaseError){
      res.status(400).json({error:error.message})
    }else if (error instanceof BaseError) {
      res.status(400).json({ error: error.message })
    } else if (error instanceof SyntaxError) {
      res.status(400).json({ error: 'Invalid JSON' })
    } else {
      console.error(error)
      res.status(500).json({
        error: 'Something went wrong, please contact your system admin',
      })
    }
  },
}
