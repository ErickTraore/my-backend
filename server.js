const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const app = express();
const port = 5000;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Configurer Sequelize pour se connecter à MySQL
const sequelize = new Sequelize('database_development', 'root', '@Erick2691', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Désactiver la journalisation si nécessaire
});

// Vérifier la connexion à la base de données
sequelize.authenticate().then(() => {
  console.log('Connexion à la base de données réussie');
}).catch((err) => {
  console.error('Échec de la connexion à la base de données :', err);
});

app.use(cors());
app.use(express.json());

app.use((req, res) => {
  console.log('Réponse envoyée à l\'utilisateur : OK');
  res.status(200).send('Server running (app-use) at http://localhost:5000');
});

// Démarrez le serveur
app.listen(port, () => {
  console.log(`Server running (app-listen) at http://localhost:${port}`);
});