const MessageController = require('../controllers/messageController')
const Auth = require('../middleware/auth')
const {Router} = require('express')

const router = new Router()

router.get('/', Auth.user, MessageController.getMessages)
router.get('/:id/messages', Auth.user, MessageController.getMessages)
router.post('/:id/send', Auth.user, MessageController.sendMessage)
router.patch('/:id/update/:msgid', Auth.user, MessageController.updateMessage)
router.delete('/:id/delete/:msgid', Auth.user, MessageController.deleteMessage)
router.post('/:id/images', Auth.user, MessageController.uploadImage)


module.exports = router