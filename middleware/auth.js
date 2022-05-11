const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

module.exports = {
  async admin(req, res, next) {
    try {
      const data = verifyToken(req);
      const user = await User.findOne({ where: { userId: data.userId } });
      if (!user) {
        throw new Error();
      } else if (user.role != "admin") {
        throw new Error();
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ error: "Unauthorized" });
    }
  },

  async worker(req, res, next) {
    try {
      const data = verifyToken(req);
      // const user = await User.findOne({ where: { userId: data.userId } });
      const user = await User.findOne({ where: { userId: data.userId } },{attributes: {exclude: ['password']}});
      if (!user) {
        throw new Error();
      } else if (user.role != "worker") {
        throw new Error();
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ error: "Unauthorized" });
    }
  },

  async client(req, res, next) {
    try {
      const data = verifyToken(req);
      const user = await User.findOne({ where: { userId: data.userId } },{attributes: {exclude: ['password']}});
      if (!user) {
        throw new Error();
      } else if (user.role != "client") {
        throw new Error();
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ error: "Unauthorized" });
    }
  },

  async user(req, res, next) {
    try {
      const data = verifyToken(req);
      const user = await User.findOne({ where: { userId: data.userId } });
      if (!user) {
        throw new Error();
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ error: "Unauthorized" });
    }
  },
};

function verifyToken(req) {
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  return data;
}
