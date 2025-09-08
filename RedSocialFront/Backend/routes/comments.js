// Backend/routes/comments.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const commentsController = require('../controllers/commentsController');

// Crear comentario en un post (requiere login)
router.post('/:postId', auth, commentsController.create);

// Listar comentarios de un post (público)
router.get('/post/:postId', commentsController.listByPost);

// Borrar comentario por id (autor del comentario o del post)
router.delete('/:id', auth, commentsController.remove);

module.exports = router;
