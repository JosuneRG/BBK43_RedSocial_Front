// Backend/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'El post debe pertenecer a un usuario'],
      index: true // Optimiza búsquedas de posts por usuario
    },
    content: { 
      type: String, 
      required: [true, 'El contenido es obligatorio'], 
      trim: true,
      minlength: [1, 'El post no puede estar vacío'],
      maxlength: [500, 'El post no puede superar los 500 caracteres']
    },
    image: {
      type: String, // opcional (por si los posts llevan foto)
    },
    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
    ],
  },
  { timestamps: true }
);

// Evitar que un mismo usuario de like dos veces
postSchema.methods.toggleLike = function (userId) {
  const index = this.likes.indexOf(userId);
  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }
  return this.save();
};

module.exports = mongoose.model('Post', postSchema);
