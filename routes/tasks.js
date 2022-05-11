const TaskController = require('../controllers/taskController')
const MessageController = require('../controllers/messageController')
const Auth = require('../middleware/auth')
const {Router} = require('express')

const router = new Router()

router.get('/', Auth.user, TaskController.getTasks)
router.get('/:id', Auth.user, TaskController.getSingleTask)//check this once
router.post('/create', Auth.worker,   TaskController.createTask)
router.patch('/:id',Auth.worker,TaskController.updateTask)
router.delete('/:id',Auth.admin,TaskController.deleteTask)

// router.get('/:id/images', Auth.user, TaskController.getImages)

// router.get('/:id/messages', Auth.user, MessageController.getMessages)
// router.post('/:id/messages', Auth.user, MessageController.postMessage)

module.exports = router