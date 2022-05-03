const User = require("./models/User");

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

    // if(result.error){
    //     res.status(403).json({
    //         error: result.message
    //     })
    // }else{
    //     res.json({
    //         token: result.token,
    //         user: result.userData
    //     })
    // }
  },

  registerClient: async (req, res) => {
    let user = await User.create(req.body);
    if (user.error) {
      res.status(400).json({
        errors: user.messages,
      });
    } else {
      res.status(200).json({
        message: "New Client registered!",
      });
    }
  },

  registerWorker: async (req, res) => {
    let user = await User.create(req.body);
    if (user.error) {
      res.status(400).json({
        errors: user.messages,
      });
    } else {
      res.status(200).json({
        message: "New worker registered!",
      });
    }
  },
};
