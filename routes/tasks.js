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

module.exports = router