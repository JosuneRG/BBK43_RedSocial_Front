// Backend/models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post', 
      required: [true, 'El comentario debe pertenecer a un post'],
      index: true // Facilita búsquedas por post
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'El comentario debe tener un autor'],
      index: true // Facilita búsquedas por usuario
    },
    content: { 
      type: String, 
      required: [true, 'El contenido del comentario es obligatorio'],
      trim: true,
      minlength: [1, 'El comentario no puede estar vacío'],
      maxlength: [300, 'El comentario no puede superar los 300 caracteres']
    },
    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Opcional: likes a comentarios
    ]
  },
  { timestamps: true }
);

// Método para dar/quitar like a un comentario
commentSchema.methods.toggleLike = function (userId) {
  const index = this.likes.indexOf(userId);
  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }
  return this.save();
};

module.exports = mongoose.model('Comment', commentSchema);
