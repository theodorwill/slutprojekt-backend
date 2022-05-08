const Message = require("../models/Message");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
    getMessages: async (req, res)=>{
        const {id} = req.params;
        const message = await Message.findAll({where: {taskId: id}})
        res.json(message)
    },
  
    postMessage: async(req, res)=>{
      const result = validateTask(req.body);
  
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

async function validateTask(body) {
    const { description, image, clientId, title } = body;
    let result = { error: false, messages: [] };
    if (!description) {
      result.error = true;
      result.messages.push("No description provided");
    }
    if (!clientId) {
      result.error = true;
      result.messages.push("No client id provided");
    } else {
      const user = await User.findOne({ where: { userId:clientId } });
      if (!user) {
        result.error = true;
        result.messages.push("No client exists with the specified client id");
      }
    }
    if (!title) {
      result.error = true;
      result.messages.push("No title provided");
    }
    return result;
  }
  
  async function getWorkerId(req) {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data.userId;
  }