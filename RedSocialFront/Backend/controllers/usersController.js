const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const readableMongooseValidation = (err) => {
  if (err && err.errors) {
    return Object.values(err.errors).map(e => e.message).join(' | ');
  }
  return err?.message || 'Error de validación';
};

const UsersController = {
  // Registro (devuelve user + token para login automático)
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }

      // Duplica email/username?
      const exists = await User.findOne({ $or: [{ email }, { username }] });
      if (exists) {
        const campo = exists.email === email ? 'email' : 'username';
        return res.status(400).json({ message: `El ${campo} ya está registrado` });
      }

      // NO hashees aquí; el pre('save') del modelo lo hace
      const newUser = await User.create({ username, email, password });

      const { password: _, ...userData } = newUser.toObject();

      if (!JWT_SECRET) {
        return res.status(500).json({ message: 'Falta JWT_SECRET en el backend' });
      }
      const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

      return res.status(201).json({ message: 'Usuario registrado', user: userData, token });
    } catch (error) {
      // Duplicados (índice único)
      if (error.code === 11000) {
        const campo = Object.keys(error.keyPattern || {})[0] || 'campo';
        return res.status(400).json({ message: `El ${campo} ya está registrado` });
      }
      // Validaciones del schema
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: readableMongooseValidation(error) });
      }
      console.error('Register error:', error);
      return res.status(500).json({ message: 'Error interno en registro' });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
      }

      // password tiene select:false en el schema
      const user = await User.findOne({ email }).select('+password');
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      const ok = await user.comparePassword(password);
      if (!ok) return res.status(401).json({ message: 'Contraseña incorrecta' });

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });

      const obj = user.toObject();
      delete obj.password;

      return res.status(200).json({ message: 'Login exitoso', user: obj, token });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Error interno en login' });
    }
  },

  async getProfile(req, res) {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'No autorizado' });
      }
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      const obj = user.toObject();
      delete obj.password;
      return res.status(200).json(obj);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener perfil de usuario' });
    }
  },

  async logout(_req, res) {
    try {
      return res.status(200).json({ message: 'Sesión cerrada. Borra el token del cliente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
  }
};

module.exports = UsersController;
