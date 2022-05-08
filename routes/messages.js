const MessageController = require('../controllers/messageController')
const Auth = require('../middleware/auth')
const {Router} = require('express')

const router = new Router()

router.get('/:id/messages', Auth.user, MessageController.getMessages)
router.post('/:id/post', Auth.user, MessageController.postMessage)
// router.patch('/:id/update/:msgid', Auth.user, MessageController.updateMessage)
// router.delete('/:id/delete/:msgid', Auth.user, MessageController.deleteMessage)
// router.post('/:id/images', Auth.user, MessageController.uploadImage)


module.exports = router