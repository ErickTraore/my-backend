const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');

const TITTLE_LIMIT = 2;
const CONTENT_LIMIT = 4;
// Routes
console.log('Voici la page messagesCtrl.js');

module.exports = {
    createMessage: function (req, res) {
        console.log('Received request body:', req.body);
        console.log('Received headers:', req.headers);
    
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        console.log('Extracted userId:', userId);
    
        const content = req.body.content;
        const tittle = req.body.tittle;
        console.log('Extracted content:', content);
        console.log('Extracted tittle:', tittle);
        console.log('Extracted content.length:', content.length);
        console.log('Extracted tittle.length:', tittle.length);
    
        if (tittle === '' || content === '') {
            console.log('Error: missing parameters');
            return res.status(400).json({ 'error': 'missing parameters' });
        }
    
        if (tittle.length <= TITTLE_LIMIT || content.length <= CONTENT_LIMIT) {
            console.log('Error: parameters do not meet length requirements');
            return res.status(400).json({ 'error': 'missing parameters LIMIT' });
        }
    
        asyncLib.waterfall([
            function (done) {
                console.log('Looking for user with id:', userId);
                models.User.findOne({
                    attributes: ['id'],
                    where: { id: userId }
                })
                    .then(function (userFound) {
                        console.log('User found:', userFound);
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        console.log('Error finding user:', err);
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    models.Message.create({
                        tittle: tittle,
                        content: content,
                        userId: userFound.id,
                        likes: 0
                    })
                     .then(function (newMessage) {
                        done(null, newMessage);
                    })
                     .catch(function (err) {
                        console.log('Error creating message:', err);
                        done(err);
                    });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function (err, newMessage) {
            if (err) {
                console.log('Error in waterfall:', err);
                return res.status(500).json({ 'error': 'cannot post message' });
            }
            if (newMessage) {
                return res.status(201).json(newMessage);
            } else {
                return res.status(500).json({ 'error': 'cannot post message' });
            }
        });
    },
 
    listMessages: function (req, res) {
        const fields = req.query.fields;
        const limit = parseInt(req.query.limit);
        const offset = parseInt(req.query.offset);
        const order = req.query.order;

        console.log('Fields:', fields);
        console.log('Limit:', limit);
        console.log('Offset:', offset);
        console.log('Order:', order);

        const headerAuth = req.headers['authorization'];
        models.Message.findAll({
                order: [(order != null) ? order.split(':') : ['tittle', 'ASC']],
                attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
                limit: (!isNaN(limit)) ? limit : null,
                offset: (!isNaN(offset)) ? offset : null,
                include: [{
                    model: models.User,
                    attributes: ['email']
                }]
            })
            .then(function (messages) {
                if (messages) {
                    res.status(200).json(messages);
                } else {
                    res.status(404).json({
                        "error": "no messages found"
                    });
                }
            })
            .catch(function (err) {
                console.log('Error:', err);
                res.status(500).json({
                    "error": "invalid fields"
                });
            });
        }
    };
