// Backend/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'El post debe pertenecer a un usuario'],
      index: true
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'El título no puede superar los 100 caracteres']
    },
    content: { 
      type: String, 
      required: [true, 'El contenido es obligatorio'], 
      trim: true,
      minlength: [1, 'El post no puede estar vacío'],
      maxlength: [500, 'El post no puede superar los 500 caracteres']
    },
    image: {
      type: String, // ruta relativa: "img/..."
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Si quieres que "post.comments?.length" sea exacto, debes mantener este array sincronizado
    // al crear/eliminar comentarios (push/pull del _id del comentario).
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
