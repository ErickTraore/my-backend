const express = require('express');
const usersCtrl = require('./routes/usersCtrl');

exports.router = (function() {
    const apiRouter = express.Router();

    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);

    return apiRouter;

})();