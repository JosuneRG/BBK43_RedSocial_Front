const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const usersController = require('../controllers/usersController');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer para avatar
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '..', 'img', 'avatars'));
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'ava_' + Date.now() + ext);
  },
});
const upload = multer({ storage });

// 1 - Registro
router.post('/register', usersController.register);

// 2 - Login
router.post('/login', usersController.login);

// 3 - Perfil del usuario autenticado
router.get('/getProfile', auth, usersController.getProfile);

// 4 - Logout
router.get('/logout', auth, usersController.logout);

// 5 - Editar perfil (username, email, bio)
router.put('/me', auth, usersController.updateProfile);

// 6 - Cambiar contraseña
router.put('/me/password', auth, usersController.changePassword);

// 7 - Subir/actualizar avatar
router.put('/me/avatar', auth, upload.single('avatar'), usersController.updateAvatar);

// 8 - Buscar usuarios por username
router.get('/search/:q', async (req, res) => {
  try {
    const q = req.params.q || '';
    const regex = new RegExp(q, 'i');
    const users = await User.find({ username: regex }, { password: 0 })
      .limit(20)
      .sort({ username: 1 });
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al buscar usuarios' });
  }
});

module.exports = router;
