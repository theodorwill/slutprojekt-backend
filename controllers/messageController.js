const Task = require("../models/Task");
const Message = require("../models/Message");
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
    const result = await validateMessage(req);
      if (!result.error){
          const author = await getUser(req)
          const message = await Message.create({
              content: req.body.content,
              taskId: req.params.id,
              authorId: author.userId,
          })
          if (message.error) {
            res.status(400).json({
              errors: message.messages,
            });
          } else {
            res.status(200).json({
              message: "New message posted",
            });
          }
      }else {
        res.status(401).json({
          error: result.messages,
        });
      }
    },
}

async function validateMessage(req) {
    const {content} = req.body
    const author = await getUser(req)
    const taskId = req.params.id
    let result = { error: false, messages: [] };
    if (!content) {
      result.error = true;
      result.messages.push("No content provided. Message body cannot be empty");
    }
    if (!taskId) {
      result.error = true;
      result.messages.push("Need to specify the id of the task in the api");
    } else {
      const task = await Task.findOne({ where: { taskId: taskId } });
      if (!task) {
        result.error = true;
        result.messages.push("No task exists with the specified task id");
      }else{
          if(!((author.userId==task.clientId)||(author.userId==task.workerId))){
              result.error = true
              result.messages.push("A message can be written only either by the worker or by the client associated with this task")
          }
      }
    }
    return result;
  }

async function getUser(req) {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  }

