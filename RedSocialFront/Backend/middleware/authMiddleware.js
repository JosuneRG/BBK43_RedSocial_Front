const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Acepta "Bearer <token>" o el token simple
  const raw = req.header('Authorization') || '';
  const token = raw.startsWith('Bearer ') ? raw.replace('Bearer ', '') : raw;

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, falta token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded._id }; // importante: _id
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = authMiddleware;
