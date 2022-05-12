const MessageController = require('../controllers/messageController')
const Auth = require('../middleware/auth')
const {Router} = require('express')

const router = new Router()

router.get('/:id/messages', Auth.user, MessageController.getMessages)
router.post('/:id/postmessage', Auth.user, MessageController.postMessage)

module.exports = router