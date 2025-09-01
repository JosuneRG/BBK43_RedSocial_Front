// Backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

async function seed() {
  try {
    // Conectar a MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones existentes
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('🗑 Colecciones limpiadas');

    // Crear usuarios
    const users = await User.create([
      { username: 'josune', email: 'josune@mail.com', password: '123456' },
      { username: 'pepe', email: 'pepe@mail.com', password: '123456' },
      { username: 'maria', email: 'maria@mail.com', password: '123456' },
    ]);
    console.log('👤 Usuarios creados');

    // Crear posts
    const posts = await Post.create([
      { user: users[0]._id, content: 'Hola, este es mi primer post!' },
      { user: users[1]._id, content: 'Me encanta esta red social!' },
      { user: users[2]._id, content: 'Buenas tardes a todos!' },
    ]);
    console.log('📝 Posts creados');

    // Crear comentarios
    await Comment.create([
      { post: posts[0]._id, user: users[1]._id, content: 'Bienvenido!' },
      { post: posts[0]._id, user: users[2]._id, content: 'Genial post!' },
      { post: posts[1]._id, user: users[0]._id, content: 'Gracias por compartir!' },
    ]);
    console.log('💬 Comentarios creados');

    console.log('🎉 Seed completado');
    process.exit();
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

seed();
