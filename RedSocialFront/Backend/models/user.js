// Backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      unique: true,
      trim: true,
      minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
      maxlength: [20, 'El nombre de usuario no puede superar 20 caracteres'],
      match: [/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'El email no es válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // No devolver la contraseña en las consultas por defecto
    },
    bio: {
      type: String,
      maxlength: [200, 'La biografía no puede superar los 200 caracteres'],
    },
    avatar: {
      type: String,
      default: 'https://i.ibb.co/2kR8Yqr/default-avatar.png',
    },
  },
  { timestamps: true }
);

// Middleware: encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Si no cambia, seguimos
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas en login
userSchema.methods.comparePassword = async function (passwordIntroducida) {
  return await bcrypt.compare(passwordIntroducida, this.password);
};

module.exports = mongoose.model('User', userSchema);
