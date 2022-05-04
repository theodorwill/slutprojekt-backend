const MessageController = require('../controllers/messageController')
const Auth = require('../middleware/auth')
const {Router} = require('express')

const router = new Router()

// router.get('/', Auth.user, MessageController.getMessages)

// router.post('/', Auth.user,   TaskController.createTask)


module.exports = router