const express = require('express');
const routes = require('./routes');


// express app
const app = express();


app.use( Logger )
app.use(express.json());


/* // register view engine
app.set('view engine', 'ejs'); */

app.use('/', routes.client);
app.use('/api/messages', routes.messages);
app.use('/api/tasks', routes.tasks);
app.use('/api', routes.auth);
app.use(_404)

// Listen for requests
const PORT = 5000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));


app.use((req, res) => {
    res.status(404).render('404');
})