const express = require('express');
const routes = require('./routes');
const Logger = require('./middleware/Logger')
const connection = require('./database/connection')
const config = require('./models/index')
const {errorHandler} = require('./errors/errorHandler')

// express app
const app = express();
//middleware
app.use( Logger )
app.use(express.json());
app.use(errorHandler)


/* // register view engine
app.set('view engine', 'ejs'); */

//routes
// app.use('/', routes.users);
// app.use('/api/messages', routes.messages);
// app.use('/api/tasks', routes.tasks);
app.use('/api', routes.auth);

app.get('/',(req,res)=>{
    res.json({message:"hellooo"})
})

// Listen for requests
    const PORT = process.env.PORT || 7000
    app.listen(PORT, ()=> console.log(`Server Running on ${PORT}`))


app.use((req, res) => {
    res.status(404).render('404');
})