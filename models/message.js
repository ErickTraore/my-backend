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
    attachment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isValidExtension(value) {
          if (value && !/\.(jpe?g|png|pdf)$/i.test(value)) {
            throw new Error('Image must be a .jpeg, .png, or .pdf file');
          }
        }
      }
    },
    video: {
      type: DataTypes.STRING,
      validate: {
        isValidVideo(value) {
          // Ici, vous devrez implémenter une logique pour vérifier la durée de la vidéo
          // Cette validation devra probablement être effectuée côté serveur lors de l'upload
        }
      }
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
