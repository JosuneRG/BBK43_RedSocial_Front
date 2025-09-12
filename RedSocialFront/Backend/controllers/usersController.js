// Backend/controllers/usersController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');
const crypto = require('crypto');
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

      // Si tu modelo tiene user.comparePassword úsalo; si no, usa bcrypt.compare
      const ok = typeof user.comparePassword === 'function'
        ? await user.comparePassword(password)
        : await bcrypt.compare(password, user.password);

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

  // Seguir usuario
  async follow(req, res) {
    try {
      const targetId = req.params.userId;
      const me = req.user._id;
      if (String(me) === String(targetId)) {
        return res.status(400).json({ message: 'No puedes seguirte a ti mismo' });
      }

      await User.findByIdAndUpdate(me, { $addToSet: { following: targetId } });
      await User.findByIdAndUpdate(targetId, { $addToSet: { followers: me } });

      return res.status(200).json({ message: 'Ahora sigues a este usuario' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Error al seguir' });
    }
  },

  // Dejar de seguir
  async unfollow(req, res) {
    try {
      const targetId = req.params.userId;
      const me = req.user._id;

      await User.findByIdAndUpdate(me, { $pull: { following: targetId } });
      await User.findByIdAndUpdate(targetId, { $pull: { followers: me } });

      return res.status(200).json({ message: 'Has dejado de seguir a este usuario' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Error al dejar de seguir' });
    }
  },

  // Listar followers/following del perfil autenticado
  async getMyNetwork(req, res) {
    try {
      const me = await User.findById(req.user._id)
        .populate('followers', 'username avatar')
        .populate('following', 'username avatar');

      if (!me) return res.status(404).json({ message: 'Usuario no encontrado' });

      return res.status(200).json({
        followers: me.followers || [],
        following: me.following || [],
        followersCount: me.followers?.length || 0,
        followingCount: me.following?.length || 0,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Error al cargar red' });
    }
  },

  // Posts likeados por el usuario autenticado
  async getMyLikedPosts(req, res) {
    try {
      const posts = await Post.find({ likes: req.user._id })
        .populate('user', 'username avatar')
        .sort({ createdAt: -1 });
      return res.status(200).json(posts);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Error al cargar posts likeados' });
    }
  },
  
  // Dentro de UsersController:
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: 'Email requerido' });

      const user = await User.findOne({ email });
      // Por seguridad, respondemos igual aunque no exista:
      if (!user) {
        return res.status(200).json({
          message: 'Si el email existe, hemos generado un enlace de reseteo.'
        });
      }

      // Generar token y caducidad (15 min)
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 15 * 60 * 1000);

      user.resetPasswordToken = token;
      user.resetPasswordExpires = expires;
      await user.save();

      // Como es demo, devolvemos el enlace en la respuesta
      const resetLink = `http://localhost:5173/reset-password/${token}`; // adapta el puerto del front si hace falta
      return res.status(200).json({
        message: 'Token generado. Usa el enlace para cambiar tu contraseña.',
        resetLink,
        token, // opcional
        expiresAt: expires
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Error al generar enlace de reseteo' });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token y nueva contraseña requeridos' });
      }
      // Buscar usuario por token y que no esté expirado
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      }).select('+password');

      if (!user) {
        return res.status(400).json({ message: 'Token inválido o expirado' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
      }

      // Guardar nueva contraseña (se hashea en pre('save'))
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(200).json({ message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Error al restablecer contraseña' });
    }
  },
};

module.exports = UsersController;
