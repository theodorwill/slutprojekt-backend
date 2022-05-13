const Task = require("../models/Task");
const User = require("../models/User");

module.exports = {
  getTasks: async (req, res, next) => {
    try {
      const user = req.user;
      let tasks;
      if (user.role === "admin") {
        tasks = await Task.findAll();
        res.status(200).json(tasks);
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
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getSingleTask: async (req, res, next) => {
    try {
      const { id } = req.params;
      const task = await Task.findOne({ where: { taskId: id } });
      const user = req.user;
      if (task) {
        if (
          !(
            user.userId == task.clientId ||
            user.userId == task.workerId ||
            user.role == "admin"
          )
        ) {
          res.status(401).json({
            error:
              "A task can be seen only either by the worker or by the client associated with this task",
          });
        } else {
          res.status(200).json(task);
        }
      } else {
        res.status(400).json({ error: "Task does not exist" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  createTask: async (req, res, next) => {
    try {
      const result = await validateTask(req.body);
      if (!result.error) {
        const worker = req.user;
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
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  updateTask: async (req, res, next) => {
    try {
      const taskId = req.params.id;
      const {description, title, status} = req.body;
      let task = await Task.findOne({ where: { taskId } });
      const user = req.user;
      let result = { error: false, messages: [] };
      if (user.userId != task.workerId) {
        res.status(400).json("Unauthorized");
      } else {
        if (task.taskId != taskId) {
          return res.status(401).json("Task not found");
        }
        var updateObject = null

        if (description) {
           updateObject = { description:description };
        }

        if (title) {
          updateObject.title = title
        }

        if (status) {
          if (
            status == "Pending" ||
            status == "Done"
          ) {
            updateObject.status = status;
          } else {
            result.error = true;
            result.messages.push(
              "Status of task should ne either Done or Pending"
            );
          }
        }

        if(updateObject){
          await task.update(updateObject);
        }
        
        if (!result.error) {
          res.status(200).json("Updated successfully");
        } else {
          res.status(401).json({ error: result.messages });
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  deleteTask: async (req, res, next) => {
    try {
      const taskId = req.params.id;
      if (!taskId) {
        res.status(400).json({ error: "No id specified" });
      } else {
        let result = await Task.destroy({ where: { taskId: req.params.id } });
        if (result == 0) {
          res.status(400).json({ error: "Could not delete task" });
        } else {
          res.status(200).json({ message: "Task deleted" });
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};

async function validateTask(body) {
  const { description, clientId, title } = body;
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


