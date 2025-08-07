const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Crear post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const post = new Post({
      user: req.user.id,
      content: req.body.content,
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el post' });
  }
});

// Obtener posts (todos o filtrados)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username firstName')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username' }
      })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener posts' });
  }
});

// Editar post (solo dueño)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    if (post.user.toString() !== req.user.id) return res.status(403).json({ message: 'No autorizado' });

    post.content = req.body.content || post.content;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar post' });
  }
});

// Eliminar post (solo dueño)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    if (post.user.toString() !== req.user.id) return res.status(403).json({ message: 'No autorizado' });

    await post.remove();

    res.json({ message: 'Post eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar post' });
  }
});

// Dar/Quitar like
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });

    const userId = req.user.id;
    const liked = post.likes.includes(userId);

    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error al dar/quitar like' });
  }
});

module.exports = router;
