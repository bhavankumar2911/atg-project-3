const PasswordResetToken = require("./models/PasswordResetToken");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

module.exports = async (req, res) => {
  const { passwordResetToken, password1, password2 } = req.body;

  if (!(passwordResetToken && password1 && password2))
    return res.json({
      message: "Enter all the fields",
    });

  if (password1 !== password2)
    return res.json({
      message: "Passwords didn't match",
    });

  try {
    const queryResult = await PasswordResetToken.findOne({
      where: { token: passwordResetToken },
    });

    if (!queryResult)
      return res.json({
        message: "Wrong password reset token. Please check your email",
      });

    //   hashing the password
    const hash = await bcrypt.hash(password2, 10);

    // changing the password
    const [affectedRows] = await User.update(
      { password: hash },
      { where: { username: queryResult.username } }
    );

    if (!affectedRows)
      return res.json({
        message: "Password not changed",
      });

    return res.json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Cannot change password. Something went wrong",
    });
  }
};
