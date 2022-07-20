const User = require("./models/User");
const validator = require("validator");
const PasswordResetToken = require("./models/PasswordResetToken");
const { google } = require("googleapis");
const { nanoid } = require("nanoid");
const nodeMailer = require("nodemailer");

const {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REFRESH_TOKEN,
} = process.env;

// creating the oauth2 client
const OAuth2Client = new google.auth.OAuth2(
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
OAuth2Client.setCredentials({ refresh_token: GOOGLE_OAUTH_REFRESH_TOKEN });

module.exports = async (req, res) => {
  const { username } = req.body;

  if (!username) return res.json({ message: "Enter username" });

  if (!validator.isAlphanumeric(username))
    return res.json({
      message: "Username should contain only alphabets and numbers",
    });

  try {
    // check if user exists
    const user = await User.findOne({ where: { username } });

    if (!user)
      return res.json({
        message: "User not found",
      });

    const email = user.email;

    // check if the email is already sent
    const token = await PasswordResetToken.findOne({ where: { username } });

    if (token)
      return res.json({
        message: "Email is already sent. Please check your inbox",
      });

    // create and save reset token in db
    const resetToken = nanoid();
    await PasswordResetToken.create({ username, token: resetToken });

    // sending the email

    // creating the access token
    const accessToken = await OAuth2Client.getAccessToken();

    // transport options
    const transportOptions = {
      service: "gmail",
      auth: {
        type: "oauth2",
        user: "bhavankumarcse2020@gmail.com",
        clientId: GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
        refreshToken: GOOGLE_OAUTH_REFRESH_TOKEN,
        accessToken,
      },
    };

    // creating nodemailer transport
    const transport = nodeMailer.createTransport(transportOptions);

    // mail options
    const mailOptions = {
      from: "Bhavan <bhavankumarcse2020@gmail.com>",
      to: email,
      subject: "Password reset mail",
      text: `Use this token for changing your password ${resetToken}`,
      html: `
                <p>Use this token for changing your password <b>${resetToken}</b></p>
          `,
    };

    // sending the mail
    const info = await transport.sendMail(mailOptions);

    if (!info) return res.json({ message: "Cannot send password reset email" });

    return res.json({ message: "Check your email for password reset token" });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Cannot reset password. Something went wrong" });
  }
};
