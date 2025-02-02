const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const server = express();
const port = 5000;

// Configurer Sequelize pour se connecter à MySQL
const sequelize = new Sequelize('database_development', 'root', '@Erick2691', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Désactiver la journalisation si nécessaire
});

// Vérifier la connexion à la base de données
sequelize.authenticate().then(() => {
  console.log('Connexion à la base de données réussie: page server.js');
}).catch((err) => {
  console.error('Échec de la connexion à la base de données :', err);
});

const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

const apiRouter = require('./apiRouter').router;

server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send('Server running (server-get-localhost) at http://localhost:5000');
});

server.get('/users', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send('Server running (server-get-user) at http://localhost:5000');
});

server.use('/api/', apiRouter);

// Démarrez le serveur
server.listen(port, () => {
  console.log(`Server running (server-listen) at http://localhost:${port}`);
});