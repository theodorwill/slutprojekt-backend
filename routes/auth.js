const AuthController = require('../controllers/authController')
const Auth = require('../middleware/auth')
const {Router} = require('express')

const router = new Router()

router.post("/auth", AuthController.authenticate);
router.post("/register", Auth.admin, AuthController.registerUser);
router.get("/users", Auth.admin, AuthController.getAllUsers);
router.delete("/deleteuser/:id", Auth.admin, AuthController.deleteUser);


module.exports = router