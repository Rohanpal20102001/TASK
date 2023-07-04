const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const isAlphanumeric = (inputString) => {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/; // Alphanumeric regex pattern
  return alphanumericRegex.test(inputString);
};

// SignUp User
const signUp = async (req, res) => {
  const { username, password } = req.body;

  // Checks if the user already exists

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(500).json({
        message: "User Already Exsists!",
      });
    }
  } catch (err) {
    console.log(err);
  }
  if (
    (username.length < 6 || username.length > 12) &&
    !isAlphanumeric(username)
  ) {
    return res.status(400).json({
      message: "enter valid username",
    });
  }

  const hashedPassword = bcrypt.hashSync(password);

  try {
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    await user.save();

    return res.status(200).json({
      userDetails: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

// SignIn User
const signIn = async (req, res) => {
  const { username, password } = req.body;

  // Check if the user is registered or not
  let user;
  try {
    user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        message: "User not found, please signup before proceeding",
      });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password" });
      } else {
        const payload = { username: username };

        const token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            if (err) {
              return res.status(500).send(err);
            }
            return res.status(200).json({
              message: "User logged in",
              token: token,
              user: {
                user,
              },
              newLogin: user.username === "NA" ? true : false,
            });
          }
        );
        user.isAccountVerified = true;
        user.username = username;
        await user.save();
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  signUp,
  signIn,
};
