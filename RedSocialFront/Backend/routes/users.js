// Backend/routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const usersController = require('../controllers/usersController');
const multer = require('multer');
const path = require('path');

// Multer avatar
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

// Auth básico
router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.get('/getProfile', auth, usersController.getProfile);
router.get('/logout', auth, usersController.logout);

// Perfil edición
router.put('/me', auth, usersController.updateProfile);
router.put('/me/password', auth, usersController.changePassword);
router.put('/me/avatar', auth, upload.single('avatar'), usersController.updateAvatar);

// Follow / unfollow
router.post('/:userId/follow', auth, usersController.follow);
router.post('/:userId/unfollow', auth, usersController.unfollow);

// Mi red (followers/following + counts)
router.get('/me/network', auth, usersController.getMyNetwork);

// Posts que he likeado
router.get('/me/liked-posts', auth, usersController.getMyLikedPosts);

// Olvida contraseña login
router.post('/forgot-password', usersController.forgotPassword);
router.post('/reset-password', usersController.resetPassword);

// Búsqueda perfiles (si la tienes)
const User = require('../models/User');
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
