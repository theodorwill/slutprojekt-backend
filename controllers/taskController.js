const Task = require('../models/Task');
const Message = require('../models/Message');

module.exports = {
    getTasks: async (req, res) => {
        if(req.user.role == 'worker'){
            tasks = await Task.findAll();
        } else {
            console.log("myLog", req.user.userId);
            tasks = await Task.findAll({where:{clientId: req.user.userId}});
        }
        res.json(tasks);
    },

    createTask: async (req, res) => {
        
        const task = await Task.create({
            status: 'Pending',
            
        })
    }

}