// Définition des fonctions pour les routes relatives aux utilisateurs
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const models = require('../models');

console.log("Je suis dans le fichier usersCtrl.js");
console.log(models.User);

module.exports = {
    register: function(req, res) {
        // Récupération des données de l'utilisateur à partir de la requête
        const email = req.body.email;
        const password = req.body.password; 
        const bio = req.body.bio;
        // Vérification des paramètres manquants
        if (email === '' || password === '') {
            console.log(req.body.email);
            return res.status(400).json({ 'error': 'Paramètres manquants' });
        }

        // Recherche de l'utilisateur dans la base de données
        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
            .then(function(userFound) {
                // Si l'utilisateur n'est pas trouvé, création d'un nouvel utilisateur
                if (!userFound) {
                    // Hachage du mot de passe
                    bcrypt.hash(password, 5, function(err, bcryptedPassword) {
                        const newUser = models.User.create({
                            email: email,
                            bio: bio,
                            password: bcryptedPassword,
                            isAdmin: 0
                        })  
                        .then(function(newUser) {
                            // Envoi de la réponse avec l'ID de l'utilisateur créé
                            return res.status(201).json({
                                'userId': newUser.id
                            });
                        })
                        .catch(function(err) {
                            // Envoi d'une erreur en cas d'échec de la création de l'utilisateur
                            return res.status(500).json({ 'error': 'Impossible d\'ajouter l\'utilisateur' });
                        });
                    });
                } else {
                    // Envoi d'une erreur en cas d'utilisateur existant
                    return res.status(500).json({ 'error': 'L\'utilisateur existe déjà' });
                }
            })
            .catch(function(err) {
                // Envoi d'une erreur en cas d'échec de la base de données
                console.log(req.body.email);
                return res.status(500).json({ 'error': 'Erreur de base de données:page usersCtrl' });
            });
    },
    login: function(req, res) {
        const { email, password } = req.body;
        const user = { email, password };
        const token = jwt.sign({ id: 1 }, 'secretkey');

        // Implémentez la logique de connexion ici
    }
};
