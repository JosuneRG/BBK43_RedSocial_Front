// Backend/routes/posts.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { PostsController } = require('../controllers/postsController');
const multer = require('multer');
const path = require('path');

// Multer: subir imágenes a /Backend/img
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '..', 'img'));
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

/**
 * IMPORTANTE: Rutas fijas ANTES de '/:id'
 */

// Posts por usuario y mis posts
router.get('/user/:userId', PostsController.getByUser);
router.get('/me', auth, PostsController.getMine);

// Búsquedas / listados públicos
router.get('/search/:name', PostsController.getPostsByName);
router.get('/paginated', PostsController.getPaginated);
router.get('/getAllPosts', PostsController.getAll); // opcional
router.get('/', PostsController.getAll);

// Crear / actualizar / eliminar (con imagen) — requieren auth
router.post('/', auth, upload.single('image'), PostsController.create);
router.put('/:id', auth, upload.single('image'), PostsController.update);
router.delete('/:id', auth, PostsController.delete);

// Likes — requieren auth
router.post('/:id/like', auth, PostsController.like);
router.post('/:id/unlike', auth, PostsController.unlike);

// Detalle por id (deja las dos por compatibilidad, pero usa '/:id' en el front)
router.get('/id/:id', PostsController.getById); // legacy/compatible
router.get('/:id', PostsController.getById);     // principal

module.exports = router;
