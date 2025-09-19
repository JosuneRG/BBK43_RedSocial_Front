// Backend/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Rutas
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const notificationsRoutes = require('./routes/notifications');
const storiesRoutes = require('./routes/stories');
const messageRoutes = require('./routes/messages');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Salud
app.get('/', (_req, res) => res.send('Servidor corriendo 🚀'));

// Archivos estáticos (ajusta paths si cambian)
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/img/avatars', express.static(path.join(__dirname, 'img', 'avatars')));

// Rutas API
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/stories', storiesRoutes);
app.use('/messages', messageRoutes);

// Manejo de errores base (opcional)
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Error interno' });
});

module.exports = app;
