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
      { username: 'ana', email: 'ana@mail.com', password: '123456' },
      { username: 'luis', email: 'luis@mail.com', password: '123456' },
      { username: 'sofia', email: 'sofia@mail.com', password: '123456' },
      { username: 'carlos', email: 'carlos@mail.com', password: '123456' },
      { username: 'laura', email: 'laura@mail.com', password: '123456' },
      { username: 'david', email: 'david@mail.com', password: '123456' },
      { username: 'martina', email: 'martina@mail.com', password: '123456' },
    ]);
    console.log('👤 Usuarios creados');

    // Crear posts con título + imagen
    const posts = await Post.create([
      { user: users[0]._id, title: 'Presentación', content: 'Hola, este es mi primer post!', image: 'img/post1.jpg' },
      { user: users[1]._id, title: 'Nueva red social', content: 'Me encanta esta red social!', image: 'img/post2.jpg' },
      { user: users[2]._id, title: 'Saludo vespertino', content: 'Buenas tardes a todos!', image: 'img/post3.jpg' },
      { user: users[3]._id, title: 'Momento café', content: 'Acabo de terminar un café ☕', image: 'img/post4.jpg' },
      { user: users[4]._id, title: 'Día de gym', content: 'Hoy toca día de gym 💪', image: 'img/post5.jpg' },
      { user: users[5]._id, title: 'React vibes', content: 'Programando en React 🚀', image: 'img/post6.jpg' },
      { user: users[6]._id, title: 'Aventura en la montaña', content: 'Viaje a la montaña 🏔️', image: 'img/post7.jpg' },
      { user: users[7]._id, title: 'Recomendación literaria', content: 'Nuevo libro recomendado 📖', image: 'img/post8.jpg' },
      { user: users[8]._id, title: 'Cena con amigos', content: 'Cena con amigos 🍕', image: 'img/post9.jpg' },
      { user: users[9]._id, title: 'Noche de concierto', content: 'Concierto increíble anoche 🎶', image: 'img/post10.jpg' },
      { user: users[0]._id, title: 'Buenos días', content: 'Buenos días comunidad ☀️', image: 'img/post11.jpg' },
      { user: users[1]._id, title: 'Estudiando MongoDB', content: 'Aprendiendo MongoDB Atlas 🗄️', image: 'img/post12.jpg' },
    ]);
    console.log('📝 Posts creados');

    // Crear comentarios
    await Comment.create([
      { post: posts[0]._id, user: users[1]._id, content: 'Bienvenido!' },
      { post: posts[0]._id, user: users[2]._id, content: 'Genial post!' },
      { post: posts[1]._id, user: users[0]._id, content: 'Gracias por compartir!' },
      { post: posts[3]._id, user: users[4]._id, content: 'Yo también amo el café ☕' },
      { post: posts[4]._id, user: users[5]._id, content: 'Motivación total 🔥' },
      { post: posts[6]._id, user: users[7]._id, content: 'Qué fotos más bonitas 😍' },
      { post: posts[8]._id, user: users[9]._id, content: 'Pizza es vida 🍕' },
      { post: posts[10]._id, user: users[3]._id, content: 'Buenos días crack!' },
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
