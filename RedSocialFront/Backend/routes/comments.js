// Backend/routes/comments.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const commentsController = require('../controllers/commentsController');

// Lista por post (pública)
router.get('/post/:postId', commentsController.listByPost);

// Crear (auth)
router.post('/:postId', auth, commentsController.create);

// Actualizar (solo autor)
router.put('/:id', auth, commentsController.update);

// Borrar (solo autor)
router.delete('/:id', auth, commentsController.remove);

// Likes de comentario (auth)
router.post('/:id/like', auth, commentsController.like);
router.post('/:id/unlike', auth, commentsController.unlike);

module.exports = router;
