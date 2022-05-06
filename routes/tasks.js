const TaskController = require('../controllers/taskController')
const Auth = require('../middleware/auth')
const {Router} = require('express')

const router = new Router()

router.get('/', Auth.user, TaskController.getTasks)
router.get('/:id', Auth.user, TaskController.getSingleTask)
router.post('/create', Auth.worker,   TaskController.createTask)
// router.patch('/:id',Auth.worker,TaskController.updateTask)
// router.delete('/:id',Auth.admin,TaskController.deleteTask)
// router.get('/:id/images', Auth.user, TaskController.getImages)


module.exports = router