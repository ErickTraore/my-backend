// Définition des fonctions pour les routes relatives aux utilisateurs
const bcrypt = require('bcryptjs');
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

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
        // Vérification de l'adresse e-mail
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'Adresse e-mail invalide' });
        }
        // Vérification du mot de passe
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'Le mot de passe doit contenir entre 4 et 8 caractères et inclure au moins un chiffre' });
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
        const email = req.body.email;
        const password = req.body.password;

          // Vérification des paramètres manquants
          if (email === '' || password === '') {
            console.log(req.body.email);
            return res.status(400).json({ 'error': 'Paramètres manquants' });
        }
        models.User.findOne({
            where: { email: email }
        })
            .then(function(userFound) {
                if (userFound) {
                    // Comparaison du mot de passe haché avec le mot de passe fourni
                    bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                        if (resBycrypt) {
                            return res.status(200).json({
                                'userId': userFound.id,
                                'token': jwtUtils.generateTokenForUser(userFound)
                            });
                        } else {
                            return res.status(403).json({ 'error': 'Mot de passe invalide' });
                        }
                    });
                } else {
                    return res.status(404).json({ 'error': 'Utilisateur non trouvé' });
                }
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur' });
    })
}};
