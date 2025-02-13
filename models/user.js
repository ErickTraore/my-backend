const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    email: Sequelize.STRING,
    bio: Sequelize.TEXT,
    password: Sequelize.STRING,
    isAdmin: Sequelize.BOOLEAN,
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { foreignKey: 'userId' });
  };

  return User;
};
