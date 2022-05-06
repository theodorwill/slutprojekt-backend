const Task = require("../models/Task");
const Message = require("../models/Message");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  getTasks: async (req, res) => {
    if (req.user.role === "worker" || req.user.role === "admin") {
      tasks = await Task.findAll();
    } else if (req.user.role === "client") {
      console.log("myLog", req.user);
      tasks = await Task.findAll({ where: { clientId: req.user.userId } });
    } else {
      res.status(401).json({
        error: "Not logged in!",
      });
    }
    res.json(tasks);
  },

  getSingleTask: async (req, res) => {
    const { id } = req.params;
    const task = await Task.findOne({ where: { taskId: id } });
    res.json(task);
  },

  createTask: async (req, res) => {
    const result = validateTask(req.body);
    if (!result.error) {
      const workerId = await getWorkerId(req);
      const { description, image, clientId, title } = req.body;

      const task = await Task.create({
        status: "Pending",
        description: description,
        image: image,
        clientId: clientId,
        workerId: workerId,
        title: title,
      });

      if (task.error) {
        res.status(400).json({
          errors: task.messages,
        });
      } else {
        res.status(200).json({
          message: "New Task created",
        });
      }

    } else {
      res.status(401).json({
        error: result.messages,
      });
    }
  },
};

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
