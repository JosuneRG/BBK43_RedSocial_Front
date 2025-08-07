const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Crear comentario
router.post('/:postId', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });

    const comment = new Comment({
      post: post._id,
      user: req.user.id,
      content: req.body.content,
    });

    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear comentario' });
  }
});

module.exports = router;
