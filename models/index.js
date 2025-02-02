const Sequelize = require('sequelize');

// Configurer Sequelize pour se connecter à MySQL
const sequelize = new Sequelize('database_development', 'root', '@Erick2691', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Désactiver la journalisation si nécessaire
});
sequelize.authenticate()
.then(() => {
  console.log('Connexion à la base de données réussie: page index.js');
})
.catch((err) => {
  console.error('Échec de la connexion à la base de données :', err);
});
// Importation des modèles
const User = require('./user')(sequelize);

// Synchronisation des modèles avec la base de données
sequelize.sync()
  .then(() => console.log('Base de données synchronisée'))
  .catch(err => console.error('Erreur de synchronisation', err));

// Exportation de sequelize et des modèles
module.exports = {
  sequelize,
  User,
};


