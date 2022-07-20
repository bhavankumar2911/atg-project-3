require("dotenv").config();
const express = require("express");
const app = express();
const registerUser = require("./registerUser");
const loginUser = require("./loginUser");
const sendPasswordResetEmail = require("./sendPasswordResetEmail");
const dbConnection = require("./dbConnection");
const cors = require("cors");
const changePassword = require("./changePassword");
const path = require("path");

// middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "index.html"), (err) => {
    if (err) return res.send("Cannot load file");
  });
});

// register user
app.post("/register", registerUser);

// login user
app.post("/login", loginUser);

// send email for password reset
app.post("/password-reset-email", sendPasswordResetEmail);

// reset password
app.post("/reset-password", changePassword);

app.listen(process.env.PORT || 9000, () =>
  console.log("Server running on port 9000...")
);

// checking db connection
dbConnection
  .authenticate()
  .then(() => console.log("Connected to database..."))
  .catch((err) => console.log("Cannot connect to database...", err));

// creating tables
dbConnection
  .sync()
  .then(() => console.log("All tables synchronized..."))
  .catch((err) => console.log("Cannot synchronize tables...", err));
