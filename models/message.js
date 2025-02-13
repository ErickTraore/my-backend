const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    tittle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Message;
};
