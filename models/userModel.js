const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('myapp', 'root', '@Erick2691', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Disable logging if not needed
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure email is unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
