const Task = require("../models/Task");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  getMessages: async (req, res, next) => {
    try{
    const { id } = req.params;
    let result = { error: false, messages: [] };
    await validateTaskUser(req, result);
    if (!result.error) {
      const taskMessages = await Message.findAll({ where: { taskId: id } });
      if (taskMessages.error) {
        res.status(400).json({
          errors: taskMessages.messages,
        });
      } else {
        res.status(200).json({
          messages: taskMessages,
        });
      }
    } else {
      res.status(401).json({
        error: result.messages,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
  },

  postMessage: async (req, res, next) => {
    try{
    const result = await validateMessage(req);
    if (!result.error) {
      // const author = await getUser(req);
      const author = req.user
      const message = await Message.create({
        content: req.body.content,
        taskId: req.params.id,
        authorId: author.userId,
      });
      if (message.error) {
        res.status(400).json({
          errors: message.messages,
        });
      } else {
        res.status(200).json({
          message: "New message posted",
        });
      }
    } else {
      res.status(401).json({
        error: result.messages,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
  },
};

async function validateMessage(req) {
  const { content } = req.body;
  let result = { error: false, messages: [] };
  if (!content) {
    result.error = true;
    result.messages.push("No content provided. Message body cannot be empty");
  }
  await validateTaskUser(req, result);
  return result;
}

async function validateTaskUser(req, result) {
  // const author = await getUser(req);
  const author = req.user
  const taskId = req.params.id;
  if (!taskId) {
    result.error = true;
    result.messages.push("Need to specify the id of the task in the api");
  } else {
    const task = await Task.findOne({ where: { taskId: taskId } });
    if (!task) {
      result.error = true;
      result.messages.push("No task exists with the specified task id");
    } else {
      if (!(author.userId == task.clientId || author.userId == task.workerId || author.role == "admin")) {
        result.error = true;
        result.messages.push(
          "A message can be seen or written only either by the worker or by the client associated with this task"
        );
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
