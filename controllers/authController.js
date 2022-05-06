const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { findOne } = require("../models/User");

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      let result = await User.authenticate(req.body.email, req.body.password);

      res.json({
        token: result.token,
        user: result.userData,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  registerClient: async (req, res) => {
    const { email, password, userName, role } = req.body;
    const body = req.body;
    let validation = await validate(body);
    if (!validation.error) {
      if (role != "client") {
        res.status(401).json({
          error: "Cannot create other than client with this endpoint",
        });
      } else {
        let user = await User.create({
          userName: userName,
          email: email,
          password: generateHash(password),
          role: role,
        });
        if (user.error) {
          res.status(400).json({
            errors: user.messages,
          });
        } else {
          res.status(200).json({
            message: "New Client registered!",
          });
        }
      }
    } else {
      res.status(401).json({
        error: validation.messages,
      });
    }
  },

  registerWorker: async (req, res) => {
    const { email, password, userName, role } = req.body;
    const body = req.body;
    let validation = await validate(body);
    if (!validation.error) {
      if (role != "worker") {
        res.status(401).json({
          error: "Cannot create other than worker with this endpoint",
        });
      } else {
        let user = await User.create({
          userName: userName,
          email: email,
          password: generateHash(password),
          role: role,
        });
        if (user.error) {
          res.status(400).json({
            errors: user.messages,
          });
        } else {
          res.status(200).json({
            message: "New Worker registered!",
          });
        }
      }
    } else {
      res.status(401).json({
        error: validation.messages,
      });
    }
  },

  // updateUser: async (req,res) => {
  //   const user = req.body
  //   console.log("update user",user)

  // }

  deleteUser: async (req, res) => {
    let user = await User.findOne({ where: { userId: req.params.id } });
    if (!user) {
      res.status(401).json({
        error: "User not found. Could not delete",
      });
    } else if (user.role == "admin") {
      res.status(403).json({
        error: "Forbidden. Cannot delete admin",
      });
    } else {
      await user.destroy();
      res.status(200).json({ message: "User deleted" });
    }
  },

  getAllUsers : async (req,res)=>{
    const users = await User.findAll({attributes: {exclude: ['password']}})
    res.status(200).json(users)
  }
};

function generateHash(password) {
  const hash = bcrypt.hashSync(password);
  return hash;
}

async function validate(body) {
  const { email, password, userName, role } = body;
  const user = await User.findOne({ where: { email: email } });
  const result = { error: false, messages: [] };
  if (user) {
    result.error = true;
    result.messages.push("Email already exists");
  }

  if (!email) {
    result.error = true;
    result.messages.push("No email provided");
  }
  if (!password) {
    result.error = true;
    result.messages.push("No password provided");
  }
  if (!userName) {
    result.error = true;
    result.messages.push("No name provided");
  }
  if (!role) {
    result.error = true;
    result.messages.push("No address provided");
  }
  if (!(role == "admin" || role == "client" || role == "worker")) {
    result.error = true;
    result.messages.push("Role sholud be either client or worker");
  }
  return result;
}
