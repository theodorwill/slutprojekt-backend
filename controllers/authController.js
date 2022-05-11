const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

  registerUser: async (req, res, next) => {
    try {
      const { email, password, userName, role } = req.body;
      const body = req.body;
      let validation = await validate(body);
      if (!validation.error) {
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
            message: "New User registered!",
          });
        }
      } else {
        res.status(401).json({
          error: validation.messages,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
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
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
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
