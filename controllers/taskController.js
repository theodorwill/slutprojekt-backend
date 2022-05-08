const Task = require("../models/Task");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  getTasks: async (req, res) => {
    const user = await getUser(req);
    let tasks;
    if (user.role === "admin") {
      tasks = await Task.findAll();
    } else if (user.role === "client") {
      tasks = await Task.findAll({ where: { clientId: user.userId } });
      res.status(200).json(tasks);
    } else if (user.role === "worker") {
      tasks = await Task.findAll({ where: { workerId: user.userId } });
      res.status(200).json(tasks);
    } else {
      res.status(401).json({
        error: "Not logged in!",
      });
    }
  },

  getSingleTask: async (req, res) => {
    const { id } = req.params;
    const task = await Task.findOne({ where: { taskId: id } });
    res.json(task);
  },

  createTask: async (req, res) => {
    const result = await validateTask(req.body);
    if (!result.error) {
      const worker = await getUser(req);
      const { description, image, clientId, title } = req.body;

      const task = await Task.create({
        status: "Pending",
        description: description,
        image: image,
        clientId: clientId,
        workerId: worker.userId,
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

  updateTask: async (req,res) => {
    const taskId = req.params.id;
    const updateFields = req.body
    const user = await getUser(req);
  let result = { error: false, messages: [] };
    if(user.role!="worker"){
      res.status(400).json("Unauthorized")
    }else{
      let task = await Task.findOne({where:{taskId}})
      if(task.taskId!=taskId){
        res.status(401).json("Task not found")
      }else{
        if(updateFields.description){
          await task.update({description:updateFields.description})
        }
        if(updateFields.title){
          await task.update({title:updateFields.title})
        }
        if(updateFields.status){
          if(updateFields.status == "Pending" || updateFields.status =="Done"){
            await task.update({status:updateFields.status})
          }else{
             result.error=true
             result.messages.push("Status of task should ne either Done or Pending")
          }
        }
        // if(image)// needs to be fixed
        if(!result.error){
          res.status(200).json("Updated successfully")
        }else{
          res.status(401).json({error:result.messages})
        }
      }
    }
  },

  deleteTask: async (req, res) => {
    const taskId = req.params.id
    if(!taskId){
      res.status(400).json({error:"No id specified"})
    }else{
      let result = await Task.destroy({where:{taskId:req.params.id }} )
        if(result==0){
            res.status(400).json({error: 'Could not delete task'})
        }else{
            res.status(200).json({message: 'Task deleted'})
        }
    }
  }
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
    const user = await User.findOne({ where: { userId: clientId } });
    if (!user) {
      result.error = true;
      result.messages.push("No client exists with the specified client id");
    } else if (user.role != "client") {
      result.error = true;
      result.messages.push(
        "Can create task only in association with client. You might have provided a worker's or admin's id"
      );
    }
  }
  if (!title) {
    result.error = true;
    result.messages.push("No title provided");
  }
  return result;
}

async function getUser(req) {
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  return data;
}
