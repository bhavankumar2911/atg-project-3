const User = require("./models/User");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.json({ message: "Enter all fields" });

  // validation
  if (!validator.isAlphanumeric(username))
    return res.json({
      message: "Username should contain only alphabets and numbers",
    });

  // check user presence
  try {
    const user = await User.findOne({ where: { username } });

    if (!user)
      return res.json({
        message: "User not found",
      });

    const isSame = await bcrypt.compare(password, user.password);

    if (!isSame)
      return res.json({
        message: "Wrong credentials. Try again",
      });

    // create jwt token
    const token = jwt.sign({ username }, "secret");

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.json({ message: "Logged in successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Cannot login. Something went wrong" });
  }
};
