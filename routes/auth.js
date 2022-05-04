const AuthController = require('../controllers/authController')
const Auth = require('../middleware/auth')
const {Router} = require('express')

const router = new Router()

router.post(  '/auth',               AuthController.authenticate)
router.post(  '/registerclient', Auth.admin,   AuthController.registerClient)
router.post(  '/registerworker', Auth.admin,   AuthController.registerWorker)
// router.delete( '/user/:id', Auth.admin,   AuthController.deleteUser)


module.exports = router