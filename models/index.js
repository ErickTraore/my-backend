const Sequelize = require('sequelize');

const sequelize = new Sequelize('database_development', 'root', '@Erick2691', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

sequelize.authenticate()
.then(() => {
  console.log('Connexion à la base de données réussie: page index.js');
})
.catch((err) => {
  console.error('Échec de la connexion à la base de données :', err);
});

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Message = require('./message')(sequelize, Sequelize.DataTypes);

// Définir les associations
User.associate({ Message });
Message.associate({ User });

sequelize.sync()
  .then(() => console.log('Base de données synchronisée'))
  .catch(err => console.error('Erreur de synchronisation', err));

module.exports = {
  sequelize,
  User,
  Message,
};


