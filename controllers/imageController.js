const fs = require("fs");
const path = require("path");
const { InvalidFile, FileExists } = require("../errors");
const Task = require("../models/Task");

module.exports = {
  getImage: async (req, res, next) => {
    try {
      const user = req.user;
      const taskId = req.params.id;
      const task = await Task.findByPk(taskId);
      if (!task) {
        res.status(400).json({ error: "Invalid task id" });
      } else if (
        !(
          user.userId == task.clientId ||
          user.userId == task.workerId ||
          user.role == "admin"
        )
      ) {
        res.status(401).json({ error: "Forbidden" });
      } else {
        const fileName = task.image;
        const image =
          path.join(__dirname, "..","uploads", fileName)
        res.sendFile( image );
      }
    } catch (error) {
      next(error);
    }
  },

  upload: async (req, res, next) => {
    try {
      let sampleFile = req.files.image;
      if (!sampleFile.mimetype.startsWith("image/")) {
        throw new InvalidFile("Invaild file, must be an image");
      } else if (
        fs.existsSync(
          path.join(__dirname, "..", "uploads", sampleFile.name)
        )
      ) {
        // throw new FileExists(sampleFile.name);
        const { id } = req.params;
        const task = await Task.findByPk(id);
        if (task) {
          let update = await task.update(
            { image: sampleFile.name },
            { where: { id } }
          );}
          res.status(200).json({message:"uploades successfully"})
      } else {
        sampleFile.mv(
          path.join(__dirname, "..", "uploads", sampleFile.name),
          function (err) {
            if (err) return res.status(500).send(err);
          }
        );
        const { id } = req.params;
        const task = await Task.findByPk(id);
        if (task) {
          let update = await task.update(
            { image: sampleFile.name },
            { where: { id } }
          );
          if (update) {
            res.json("Image uploaded successfully");
          } else {
            res.status(400).json({ error: "Couldn't upload image" });
          }
        } else {
          res
            .status(400)
            .json({ error: "Couldn't find task with the specified id" });
        }
      }
    } catch (error) {
      next(error);
    }
  },
};
