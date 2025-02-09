const express = require('express');
const usersCtrl = require('./routes/usersCtrl');
const authMiddleware = require('./middleware/authMiddleware'); // Assurez-vous d'utiliser le bon chemin vers authMiddleware

exports.router = (function() {
    const apiRouter = express.Router();

    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/me/').get(authMiddleware, usersCtrl.getUserProfile); // Route protégée
    apiRouter.route('/users/me/').put(authMiddleware, usersCtrl.updateUserProfile); // Route protégée

    return apiRouter;
})();
