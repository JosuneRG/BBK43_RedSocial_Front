const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const readableMongooseValidation = (err) => {
  if (err && err.errors) {
    return Object.values(err.errors).map((e) => e.message).join(' | ');
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

      const exists = await User.findOne({ $or: [{ email }, { username }] });
      if (exists) {
        const campo = exists.email === email ? 'email' : 'username';
        return res.status(400).json({ message: `El ${campo} ya está registrado` });
      }

      // El hash lo hace el pre('save') del modelo
      const newUser = await User.create({ username, email, password });
      const obj = newUser.toObject();
      delete obj.password;

      if (!JWT_SECRET) {
        return res.status(500).json({ message: 'Falta JWT_SECRET en el backend' });
      }

      const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
      return res.status(201).json({ message: 'Usuario registrado', user: obj, token });
    } catch (error) {
      if (error.code === 11000) {
        const campo = Object.keys(error.keyPattern || {})[0] || 'campo';
        return res.status(400).json({ message: `El ${campo} ya está registrado` });
      }
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

  // Perfil del usuario autenticado
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

  // Logout "lógico"
  async logout(_req, res) {
    try {
      return res.status(200).json({ message: 'Sesión cerrada. Borra el token del cliente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
  },

  // Editar username/email/bio
  async updateProfile(req, res) {
    try {
      const { username, email, bio } = req.body;
      const userId = req.user._id;

      if (!username || !email) {
        return res.status(400).json({ message: 'Username y email son requeridos' });
      }

      const exists = await User.findOne({
        $or: [{ email }, { username }],
        _id: { $ne: userId },
      });

      if (exists) {
        const campo = exists.email === email ? 'email' : 'username';
        return res.status(400).json({ message: `El ${campo} ya está en uso` });
      }

      const updated = await User.findByIdAndUpdate(
        userId,
        { $set: { username, email, bio } },
        { new: true }
      ).select('-password');

      return res.status(200).json(updated);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Error al actualizar perfil' });
    }
  },

  // Cambiar contraseña
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id).select('+password');

      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) return res.status(400).json({ message: 'La contraseña actual no es correcta' });

      if (!newPassword || newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      return res.status(200).json({ message: 'Contraseña actualizada' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Error al cambiar contraseña' });
    }
  },

  // Subir/actualizar avatar
  async updateAvatar(req, res) {
    try {
      if (!req.file) return res.status(400).json({ message: 'Falta archivo avatar' });

      const relativePath = `img/avatars/${req.file.filename}`;
      const updated = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatar: relativePath } },
        { new: true }
      ).select('-password');

      return res.status(200).json(updated);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Error al actualizar avatar' });
    }
  },
};

module.exports = UsersController;
