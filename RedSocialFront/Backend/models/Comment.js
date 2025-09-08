// Backend/models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: {
      type: String,
      required: [true, 'El comentario no puede estar vacío'],
      trim: true,
      minlength: [1, 'El comentario no puede estar vacío'],
      maxlength: [300, 'Máximo 300 caracteres']
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
