const express = require('express')
const routes = require('./routes')
const Logger = require('./middleware/Logger')
const connection = require('./database/connection')
const config = require('./models/index')
const { errorHandler } = require('./errors/errorHandler')
const fileUpload = require('express-fileupload')

// express app
const app = express()
//middleware
app.use(Logger)
app.use(express.json())
app.use(express.static('public'))
app.use(fileUpload({useTempFiles : true}))

//routes
app.use('/api', routes.auth);
app.use('/api/tasks', routes.messages);
app.use('/api/tasks', routes.tasks);
app.use('/api/tasks', routes.images);
app.use(errorHandler)

// Listen for requests
const PORT = process.env.PORT || 7000
app.listen(PORT, () => console.log(`Server Running on ${PORT}`))


