// Backend/controllers/commentsController.js
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const commentsController = {
  // Crear un comentario en un determinado post
  async commentPost(req, res) {
    try {
      const { content } = req.body; // usar "content" según el modelo
      const postId = req.params.postId;

      if (!content) {
        return res.status(400).json({ message: 'Contenido requerido' });
      }

      if (!postId) {
        return res.status(400).json({ message: 'PostId es requerido' });
      }

      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      // Crear comentario
      const comment = await Comment.create({
        content,
        user: req.user._id,
        post: postId
      });

      // Agregar el comentario al array de comentarios del post
      await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment._id } },
        { new: true }
      );

      res.status(201).json({ message: 'Comentario creado', comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear el comentario', error: error.message });
    }
  }
};

module.exports = commentsController;
