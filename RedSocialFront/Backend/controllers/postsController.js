// Backend/controllers/postsController.js
const mongoose = require('mongoose');
const Post = require('../models/Post');

const populatePost = (query) =>
  query
    .populate('user', 'username email')
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'username avatar' },
    });

const PostsController = {
  // Crear post
  async create(req, res) {
    try {
      const { title, content } = req.body;
      if (!content) return res.status(400).json({ message: 'El contenido es obligatorio' });

      const imagePath = req.file ? `img/${req.file.filename}` : null;

      const newPost = await Post.create({
        user: req.user._id,
        title: title || '',
        content,
        image: imagePath,
      });

      const populated = await populatePost(Post.findById(newPost._id));
      const post = await populated;
      return res.status(201).json({ message: 'Post creado.', post });
    } catch (error) {
      console.error('create error:', error);
      return res.status(500).json({ message: 'Error al crear el post' });
    }
  },

  // Actualizar post
  async update(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de post no válido' });
      }

      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: 'Post no encontrado' });

      if (String(post.user) !== String(req.user._id))
        return res.status(403).json({ message: 'No autorizado' });

      const update = { ...req.body };
      if (req.file) update.image = `img/${req.file.filename}`;

      await Post.findByIdAndUpdate(id, { $set: update });

      const populated = await populatePost(Post.findById(id));
      const updatedPost = await populated;

      return res.status(200).json({ message: 'Post actualizado', post: updatedPost });
    } 
    catch (error) {
      console.error('update error:', error);
      return res.status(500).json({ message: 'Error al actualizar el post' });
    }
  },

  // Eliminar post
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de post no válido' });
      }

      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: 'Post no encontrado' });

      if (String(post.user) !== String(req.user._id))
        return res.status(403).json({ message: 'No autorizado' });

      await Post.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Post eliminado correctamente' });
    } catch (error) {
      console.error('delete error:', error);
      return res.status(500).json({ message: 'Error al eliminar el post' });
    }
  },

  // Traer todos los posts
  async getAll(_req, res) {
    try {
      const posts = await populatePost(
        Post.find().sort({ createdAt: -1 })
      );
      return res.status(200).json(await posts);
    } catch (error) {
      console.error('getAll error:', error);
      return res.status(500).json({ message: 'Error al obtener posts' });
    }
  },

  // Buscar por TÍTULO (case-insensitive, escapando regex)
  async getPostsByName(req, res) {
    try {
      const raw = (req.params.name || '').trim();
      if (!raw) {
        // consulta vacía => lista vacía
        return res.status(200).json([]);
      }

      // Escapar caracteres especiales de regex para evitar falsos positivos
      const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i'); // coincidencia parcial, sin distinguir mayúsculas

      const posts = await Post.find({ title: { $regex: regex } })
        .populate('user', 'username avatar')
        .populate({
          path: 'comments',
          populate: { path: 'user', select: 'username avatar' },
        })
        .sort({ createdAt: -1 });

      return res.status(200).json(posts);
    } catch (error) {
      console.error('getPostsByName error:', error);
      return res.status(500).json({ message: 'Error al buscar post por título' });
    }
  },

  // Traer post por ID (con validación)
  async getById(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de post no válido' });
      }

      const q = populatePost(Post.findById(id));
      const post = await q;

      if (!post) return res.status(404).json({ message: 'Post no encontrado' });
      return res.status(200).json(post);
    } catch (error) {
      console.error('getById error:', error);
      return res.status(500).json({ message: 'Error al obtener post por ID' });
    }
  },

  // posts de un usuario concreto (público)
  async getByUser(req, res) {
    try {
      const { userId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'ID de usuario no válido' });
      }

      const posts = await populatePost(
        Post.find({ user: userId }).sort({ createdAt: -1 })
      );
      return res.status(200).json(await posts);
    } catch (error) {
      console.error('getByUser error:', error);
      return res.status(500).json({ message: 'Error al obtener posts del usuario' });
    }
  },

  // posts del usuario autenticado
  async getMine(req, res) {
    try {
      const posts = await populatePost(
        Post.find({ user: req.user._id }).sort({ createdAt: -1 })
      );
      return res.status(200).json(await posts);
    } catch (error) {
      console.error('getMine error:', error);
      return res.status(500).json({ message: 'Error al obtener tus posts' });
    }
  },

  // Paginación
  async getPaginated(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const posts = await populatePost(
        Post.find().skip(skip).limit(limit).sort({ createdAt: -1 })
      );
      return res.status(200).json(await posts);
    } catch (error) {
      console.error('getPaginated error:', error);
      return res.status(500).json({ message: 'Error al paginar posts' });
    }
  },

  // Likes (devolver SIEMPRE el post poblado)
  async like(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de post no válido' });
      }

      await Post.findByIdAndUpdate(
        id,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      );

      const post = await populatePost(Post.findById(id));
      return res.status(200).json(await post);
    } catch (error) {
      console.error('like error:', error);
      return res.status(500).json({ message: 'Error al dar like' });
    }
  },

  async unlike(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de post no válido' });
      }

      await Post.findByIdAndUpdate(
        id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      const post = await populatePost(Post.findById(id));
      return res.status(200).json(await post);
    } catch (error) {
      console.error('unlike error:', error);
      return res.status(500).json({ message: 'Error al quitar like' });
    }
  },
};

module.exports = { PostsController };
