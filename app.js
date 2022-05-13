const express = require('express')
const routes = require('./routes')
const Logger = require('./middleware/Logger')
const connection = require('./database/connection')
const config = require('./models/index')
const { errorHandler } = require('./errors/errorHandler')
const fileUpload = require('express-fileupload')

// express app
const app = express()

const http = require('http')
const {Server} = require('socket.io')

const server = http.createServer(app)

//middleware
app.use(Logger)
app.use(express.json())
app.use(fileUpload({useTempFiles : true}))
app.use(express.static('public'))

//routes
app.use('/api', routes.auth);
app.use('/api/tasks', routes.messages);
app.use('/api/tasks', routes.tasks);
app.use('/api/tasks', routes.images);
app.use(errorHandler)

const PORT = process.env.PORT || 7000

// Receiving socket
const socketIn = new Server(server)
socketIn
.on('connection', socket => {
  console.log("Client connected with ID: " + socket.id);

  socket.on('newMessage', function(msg) {
    console.log('A new message has been posted: ', msg)
  });

  socket.on('disconnect', () => {
    console.log("Client disconnected");
  })
})

// Sending socket
var io = require('socket.io-client');
var socketOut = io.connect('http://localhost:' + PORT)
app.set('socketOut', socketOut);

// Listen for requests
server.listen(PORT, () => console.log(`Server Running on ${PORT}`))

app.use((req,res)=>{
    res.status(404).json({error:"The requested page is not found"})
})


