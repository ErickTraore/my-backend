const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    email: Sequelize.STRING,
    bio: Sequelize.TEXT,
    password: Sequelize.STRING,
    isAdmin: Sequelize.BOOLEAN,
  });

  return User;
};