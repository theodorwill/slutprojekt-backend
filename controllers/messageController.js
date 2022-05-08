const Task = require("../models/Task");
const Message = require("../models/Message");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
    getMessages: async (req, res)=>{
        const {id} = req.params;
        const message = await Message.findAll({where: {taskId: id}})
        res.json(message)
        const user = await getUser(req);
    let messages;
    if (user.role === "admin") {
      messages = await Task.findAll();
    } else if (user.role === "client") {
      messages = await Task.findAll({ where: { clientId: user.userId } });
      res.status(200).json(messages);
    } else if (user.role === "worker") {
      messages = await Task.findAll({ where: { workerId: user.userId } });
      res.status(200).json(messages);
    } else {
      res.status(401).json({
        error: "Not logged in!",
      });
    }
    },

    postMessage: async(req, res)=>{

      const {id} = req.params;
      const {content} = req.body

      if (!result.error){
          const message = await Message.create({
              content: content,
              taskId: id,
              authorId: req.user.userId,
          })
          res.json(message)
      }
    },
}

