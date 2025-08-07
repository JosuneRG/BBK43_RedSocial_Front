import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';

dotenv.config();

const usersData = [
  {
    firstName: 'Juan',
    username: 'juan123',
    email: 'juan@example.com',
    password: '123456', // ojo, normalmente debes hashear la contraseña
  },
  {
    firstName: 'Ana',
    username: 'ana456',
    email: 'ana@example.com',
    password: '123456',
  },
];

const postsData = [
  {
    title: 'Primer post de Juan',
    content: 'Este es el primer post de Juan',
  },
  {
    title: 'Post de Ana',
    content: 'Contenido del post de Ana',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado para seed');

    // Limpia colecciones antes de insertar (opcional)
    await User.deleteMany();
    await Post.deleteMany();

    // Inserta usuarios
    const createdUsers = await User.insertMany(usersData);

    // Inserta posts asociados a los usuarios creados
    const postsToInsert = postsData.map((post, i) => ({
      ...post,
      author: createdUsers[i % createdUsers.length]._id,
    }));

    await Post.insertMany(postsToInsert);

    console.log('Seed completado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
}

seed();
