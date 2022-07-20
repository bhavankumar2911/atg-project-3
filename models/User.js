const dbConnection = require("../dbConnection");
const { DataTypes } = require("sequelize");
const { STRING } = DataTypes;

module.exports = dbConnection.define("User", {
  email: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: STRING,
    allowNull: false,
  },
});
