// Backend/controllers/postController.js
const Post = require('../models/Post');

const PostsController = {
  // Crear post
  async create(req, res) {
    try {
      const { title, content } = req.body;
      if (!content) return res.status(400).json({ message: "El contenido es obligatorio" });

      const imagePath = req.file ? `img/${req.file.filename}` : null;

      const newPost = await Post.create({
        user: req.user._id,
        title,
        content,
        image: imagePath,
      });

      res.status(201).json({ message: "Post creado.", post: newPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el post" });
    }
  },

  // Actualizar post
  async update(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post no encontrado" });
      if (post.user.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "No autorizado" });

      if (req.file) req.body.image = `img/${req.file.filename}`;

      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json({ message: "Post actualizado", post: updatedPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el post" });
    }
  },

  // Eliminar post
  async delete(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post no encontrado" });
      if (post.user.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "No autorizado" });

      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Post eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el post" });
    }
  },

  // Traer todos los posts
  async getAll(_req, res) {
    try {
      const posts = await Post.find()
        .populate("user", "username email")
        .populate("comments.user", "username")
        .sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener posts" });
    }
  },

  // Buscar por nombre (ahora busca en title o content)
  async getPostsByName(req, res) {
    try {
      const regex = new RegExp(req.params.name, "i");
      const posts = await Post.find({ $or: [{ title: regex }, { content: regex }] });
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al buscar post por nombre" });
    }
  },

  // Traer post por ID
  async getById(req, res) {
    try {
      const post = await Post.findById(req.params.id)
        .populate("user", "username email")
        .populate("comments.user", "username");
      if (!post) return res.status(404).json({ message: "Post no encontrado" });
      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener post por ID" });
    }
  },

  // Paginación
  async getPaginated(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const posts = await Post.find()
        .skip(skip)
        .limit(limit)
        .populate("user", "username")
        .sort({ createdAt: -1 });

      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al paginar posts" });
    }
  },

  // Likes
  async like(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      );
      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al dar like" });
    }
  },

  async unlike(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );
      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al quitar like" });
    }
  }
};

module.exports = { PostsController };
