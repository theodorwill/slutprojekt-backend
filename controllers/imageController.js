const fs = require("fs");
const path = require("path");
const { InvalidFile, FileExists } = require("../errors");
const Task = require("../models/Task");

module.exports = {
//not needed
//   getAll: (req, res) => {
//     const images = fs.readdirSync(
//       path.join(__dirname, "..", "public", "images")
//     );
//     res.json({ images });
//   },

  upload: async (req, res, next) => {
    try {
      let sampleFile = req.files.image;
      if (!sampleFile.mimetype.startsWith("image/")) {
        throw new InvalidFile("Invaild file, must be an image");
      } else if (
        fs.existsSync(
          path.join(__dirname, "..", "public", "images", sampleFile.name)
        )
      ) {
        throw new FileExists(sampleFile.name);
      } else {
        sampleFile.mv(
          path.join(__dirname, "..", "public", "images", sampleFile.name),
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
          }
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};