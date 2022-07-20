const dbConnection = require("../dbConnection");
const { DataTypes } = require("sequelize");
const { STRING, TEXT } = DataTypes;

module.exports = dbConnection.define("PasswordResetToken", {
  username: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  token: {
    type: TEXT,
    allowNull: false,
    unique: true,
  },
});
