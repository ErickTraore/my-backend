const express = require('express');
const usersCtrl = require('./routes/usersCtrl');
const authMiddleware = require('./middleware/authMiddleware'); // Assurez-vous d'utiliser le bon chemin vers authMiddleware
const messagesCtrl = require('./routes/messagesCtrl');

exports.router = (function() {
    const apiRouter = express.Router();

    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/me/').get(authMiddleware, usersCtrl.getUserProfile); // Route protégée
    apiRouter.route('/users/me/').put(authMiddleware, usersCtrl.updateUserProfile); // Route protégée
    apiRouter.route('/messages/new/').post(authMiddleware, messagesCtrl.createMessage); // Route protégée
    apiRouter.route('/messages/').get(authMiddleware, messagesCtrl.listMessages); // Route protégée

    return apiRouter;
})();
