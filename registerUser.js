const User = require("./models/User");
const validator = require("validator");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
  const { email, username, password1, password2 } = req.body;

  //   validation
  if (!email || !username || !password1 || !password2)
    return res.json({ message: "Enter all fields" });

  if (!validator.isEmail(email))
    return res.json({ message: "Enter a valid email address" });

  if (!validator.isAlphanumeric(username))
    return res.json({
      message: "Username should contain only alphabets and numbers",
    });

  if (password1 !== password2)
    return res.json({ message: "Passwords didn't match" });

  // checking for user duplication
  try {
    const queryResult = await User.findOne({
      where: { [Op.or]: { username, email } },
    });

    if (queryResult) {
      if (queryResult.username == username)
        return res.json({
          message: "Username is already taken",
        });

      if (queryResult.email == email)
        return res.json({
          message: "Email is already registered",
        });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      message: "User not registered. Something went wrong",
    });
  }

  //   saving user in db
  try {
    // hashing password
    const hash = await bcrypt.hash(password1, 10);

    const queryResult = await User.create({
      email,
      username,
      password: hash,
    });

    return res.json({ message: "User registered" });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Cannot register user. Something went wrong" });
  }
};
