const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const UsersController = {
  // Registro de usuario
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email ya registrado' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword
      });

      const { password: _, ...userData } = newUser.toObject();
      res.status(201).json({ message: 'Usuario registrado', user: userData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar usuario' });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
      }

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  },

  // Perfil del usuario
  async getProfile(req, res) {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'No autorizado' });
      }

      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      const userData = user.toObject();
      delete userData.password;

      res.status(200).json(userData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener perfil de usuario' });
    }
  },

  // Logout
  async logout(req, res) {
    try {
      res.status(200).json({ message: 'Sesión cerrada. Borra el token del cliente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al cerrar sesión' });
    }
  }
};

module.exports = UsersController;
