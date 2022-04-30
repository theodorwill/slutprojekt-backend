const TaskController = require('../controllers/taskController')
const Auth = require('../middleware/auth')
const {Router} = require('express')

const router = new Router()

router.post(  '/auth',               AuthController.authenticate)
router.post(  '/', Auth.user,   TaskController.createTask)


module.exports = router