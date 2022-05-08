const { Router } = require('express')
const Auth = require('../middleware/auth')
const ImageController = require('../controllers/imageController')
const router = new Router()

router.get('/', Auth.worker, ImageController.getAll)
router.post('/', Auth.worker, ImageController.upload)

module.exports = router
