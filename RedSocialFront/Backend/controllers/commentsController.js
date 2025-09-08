// Backend/controllers/commentsController.js
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const commentsController = {
  // Crear comentario
  async create(req, res) {
    try {
      const { content } = req.body;
      const { postId } = req.params;

      if (!content || !postId) {
        return res.status(400).json({ message: 'Contenido y postId son requeridos' });
      }

      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post no encontrado' });

      const comment = await Comment.create({
        content,
        post: postId,
        user: req.user._id,
      });

      // MANTENER referencia en Post
      await Post.findByIdAndUpdate(postId, { $addToSet: { comments: comment._id } });

      const populated = await Comment.findById(comment._id)
        .populate('user', 'username avatar')
        .populate('post', 'user');

      return res.status(201).json({ message: 'Comentario creado', comment: populated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al crear comentario' });
    }
  },

  // Listar comentarios de un post
  async listByPost(req, res) {
    try {
      const { postId } = req.params;
      const comments = await Comment.find({ post: postId })
        .populate('user', 'username avatar')
        .sort({ createdAt: -1 });

      return res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener comentarios' });
    }
  },

  // Borrar comentario (autor del comentario o autor del post)
  async remove(req, res) {
    try {
      const { id } = req.params; // id del comentario
      const comment = await Comment.findById(id).populate('post', 'user');

      if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

      const isOwnerComment = comment.user.toString() === req.user._id.toString();
      const isOwnerPost = comment.post.user.toString() === req.user._id.toString();

      if (!isOwnerComment && !isOwnerPost) {
        return res.status(403).json({ message: 'No autorizado para borrar este comentario' });
      }

      await Comment.findByIdAndDelete(id);
      // Quitar referencia en Post
      await Post.findByIdAndUpdate(comment.post._id, { $pull: { comments: comment._id } });

      return res.status(200).json({ message: 'Comentario eliminado' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al eliminar comentario' });
    }
  },
};

module.exports = commentsController;
