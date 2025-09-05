const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, falta token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 👇 importante: usa _id (no id)
    req.user = { _id: decoded._id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = authMiddleware;
