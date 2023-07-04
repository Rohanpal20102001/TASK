const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    let token;
    if (authHeader) {
      token = req.header("Authorization").replace("Bearer ", "");
    } else {
      token = req.query.token.replace("Bearer ", "");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      username: decode.username,
    });
    if (!user) {
      throw new Error("User not found with given information");
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("UnAuthorized");
  }
};

module.exports = { auth };
