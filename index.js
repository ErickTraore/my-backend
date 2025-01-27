const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Importer bcryptjs pour le hachage
const jwt = require('jsonwebtoken'); // Importer jsonwebtoken pour les tokens JWT
const User = require('./models/userModel'); // Importer le modèle utilisateur
const app = express();
const port = 5000;

// Configurer Sequelize pour se connecter à MySQL
// const sequelize = new Sequelize('myapp', 'root', '@Erick2691', {
//   host: 'localhost',
//   dialect: 'mysql',
//   logging: false, // Disable logging if not needed
// });

app.use(cors());
app.use(express.json());

// Synchroniser le modèle avec la base de données
// sequelize.sync().then(() => {
//   console.log('Database & tables created!');
// });

// repondre au browser http
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Définir une route POST pour le point de terminaison "/register"
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  console.log('Received registration data:', { username, email, password }); // Logger les données reçues

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hacher le mot de passe
    const newUser = await User.create({ username, email, password: hashedPassword }); // Créer et enregistrer un nouvel utilisateur

    res.status(200).json({ message: 'Registration successful!', user: newUser });
  } catch (error) {
    console.error('Error saving user to database:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message }); // Ajouter le message d'erreur dans la réponse
  }
});

// Définir une route POST pour le point de terminaison "/login"
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login data:', { email, password }); // Logger les données reçues

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    console.log('Found user:', user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// repondre au terminal
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
