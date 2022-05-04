const Task = require('../models/Task');
const Message = require('../models/Message');

module.exports = {
    getTasks: async (req, res) => {
        if(req.user.role === 'worker' || req.user.role === 'admin'){
            tasks = await Task.findAll();
        } else if(req.user.role === 'client'){
            console.log("myLog", req.user);
            tasks = await Task.findAll({where:{clientId: req.user.userId}});
        } else {
            res.status(401).json({
                error:"Not logged in!"
              })
        }
        res.json(tasks);
    },

    createTask: async (req, res) => {
        const task = await Task.create({
            status: 'Pending',

        })
    }

}