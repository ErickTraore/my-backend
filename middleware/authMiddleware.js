const jwtUtils = require('../utils/jwt.utils');

module.exports = (req, res, next) => {
  const authorization = req.headers['authorization'];
  const userId = jwtUtils.getUserId(authorization);

  if (userId < 0) {
    return res.status(401).json({ error: 'Accès refusé. Token invalide ou manquant.' });
  }
  req.userId = userId;
  next();
};
