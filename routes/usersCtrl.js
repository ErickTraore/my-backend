// Définition des fonctions pour les routes relatives aux utilisateurs
const bcrypt = require('bcryptjs');
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');
const asyncLib = require('async');

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

        asyncLib.waterfall([
            function(done) {
                models.User.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                    .then(function(userFound) {
                        done(null, userFound);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur' });
                    });
            },
            function(userFound, done) {
                if (!userFound) {
                    bcrypt.hash(password, 5, function(err, bcryptedPassword) {
                        done(null, userFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({ 'error': 'L\'utilisateur existe déjà' });
                }
            },
            function(userFound, bcryptedPassword, done) {
                const newUser = models.User.create({
                    email: email,
                    password: bcryptedPassword,
                    bio: bio,
                    isAdmin: 0
                })
                    .then(function(newUser) {
                        done(newUser);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'Impossible d\'ajouter l\'utilisateur' });
                    });
            }
        ], function(newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id,
                    'message': 'Inscription réussie, redirection vers la page de connexion...',
                    'redirectUrl': '/#login'
                });
            } else {
                return res.status(500).json({ 'error': 'Impossible d\'ajouter l\'utilisateur' });
            }
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
                                'token': jwtUtils.generateTokenForUser(userFound),
                                'redirectUrl': '/#contact',
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
    },
    getUserProfile: function(req, res) {
    // Récupération de l'en-tête d'autorisation
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0)
        return res.status(400).json({ 'error': 'Token invalide' });

    models.User.findOne({
        attributes: ['id', 'email', 'bio'],
        where: { id: userId }
    }).then(function(user) {
        if (user) {
            res.status(201).json(user);
        } else {
            res.status(404).json({ 'error': 'Utilisateur non trouvé' });
        }
    }).catch(function(err) {
        res.status(500).json({ 'error': 'Impossible de récupérer l\'utilisateur' });
    });

    },
    updateUserProfile: function(req, res) {
        // Récupération de l'en-tête d'autorisation
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        // Paramètres
        const bio = req.body.bio;

        asyncLib.waterfall([
            function(done) {
                models.User.findOne({
                    attributes: ['id', 'bio'],
                    where: { id: userId }
                }).then(function (userFound) {
                    done(null, userFound);
                }).catch(function(err) {
                    return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur' });
                });
            },
            function(userFound, done) {
                if (userFound) {
                    userFound.update({
                        bio: (bio ? bio : userFound.bio)
                    }).then(function() {
                        done(userFound);
                    }).catch(function(err) {
                        res.status(500).json({ 'error': 'Impossible de mettre à jour l\'utilisateur' });
                    });
                } else {
                    res.status(404).json({ 'error': 'Utilisateur non trouvé' });
                }
            },
        ], function(userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': 'Impossible de mettre à jour l\'utilisateur' });
            }
        });
    }

};
