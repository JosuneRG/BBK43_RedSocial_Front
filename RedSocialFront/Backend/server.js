// Backend/server.js
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('JWT_SECRET cargado:', process.env.JWT_SECRET ? '✅' : '❌ FALTA');

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Servidor corriendo 🚀');
});

// estáticos para imágenes
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/img/avatars', express.static(path.join(__dirname, 'img', 'avatars')));

// rutas
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
