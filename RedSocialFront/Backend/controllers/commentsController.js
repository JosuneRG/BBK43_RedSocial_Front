// Backend/controllers/commentsController.js
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const commentsController = {
  // Crear comentario
  async create(req, res) {
    try {
      const { content } = req.body;
      const { postId } = req.params;
      if (!content || !postId) return res.status(400).json({ message: 'Contenido y postId son requeridos' });

      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post no encontrado' });

      const comment = await Comment.create({ content, post: postId, user: req.user._id });
      const populated = await Comment.findById(comment._id)
        .populate('user', 'username avatar')
        .populate('post', '_id');

      return res.status(201).json({ message: 'Comentario creado', comment: populated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al crear comentario' });
    }
  },

  // Listar por post
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

  // Actualizar (solo autor)
  async update(req, res) {
    try {
      const { id } = req.params; // id del comentario
      const { content } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ message: 'El comentario no puede estar vacío' });
      }

      const comment = await Comment.findById(id);
      if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

      const isOwnerComment = String(comment.user) === String(req.user._id);
      if (!isOwnerComment) {
        return res.status(403).json({ message: 'Solo el autor puede editar este comentario' });
      }

      comment.content = content.trim();
      await comment.save();

      const populated = await Comment.findById(comment._id)
        .populate('user', 'username avatar');

      return res.status(200).json({ message: 'Comentario actualizado', comment: populated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al editar comentario' });
    }
  },

  // Eliminar (solo autor o dueño del post si quieres, pero mantenemos SOLO autor)
  async remove(req, res) {
    try {
      const { id } = req.params;
      const comment = await Comment.findById(id);
      if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

      if (comment.user.toString() !== req.user._id.toString())
        return res.status(403).json({ message: 'No autorizado' });

      await Comment.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Comentario eliminado' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al eliminar comentario' });
    }
  },

  // Like comentario
  async like(req, res) {
    try {
      const { id } = req.params;
      const updated = await Comment.findByIdAndUpdate(
        id,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      ).populate('user', 'username avatar');
      if (!updated) return res.status(404).json({ message: 'Comentario no encontrado' });
      return res.status(200).json(updated);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Error al dar like al comentario' });
    }
  },

  // Unlike
  async unlike(req, res) {
    try {
      const { id } = req.params;
      const updated = await Comment.findByIdAndUpdate(
        id,
        { $pull: { likes: req.user._id } },
        { new: true }
      ).populate('user', 'username avatar');
      if (!updated) return res.status(404).json({ message: 'Comentario no encontrado' });
      return res.status(200).json(updated);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Error al quitar like del comentario' });
    }
  },
};

module.exports = commentsController;
