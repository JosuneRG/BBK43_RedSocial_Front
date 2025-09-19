const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = require('./app');
const Message = require('./models/Message');
const User = require('./models/User');

const server = http.createServer(app);

// --- Socket.IO ---
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'], // URL del front (Vite). Añade más si usas otras.
    credentials: true,
  },
});

// Mapear userId -> socketId(s) por si el usuario abre varias pestañas
const userSockets = new Map(); // userId => Set(socketId)

function addUserSocket(userId, socketId) {
  const set = userSockets.get(userId) || new Set();
  set.add(socketId);
  userSockets.set(userId, set);
}
function removeUserSocket(userId, socketId) {
  const set = userSockets.get(userId);
  if (!set) return;
  set.delete(socketId);
  if (set.size === 0) userSockets.delete(userId);
}
function emitToUser(userId, event, payload) {
  const set = userSockets.get(userId);
  if (!set) return;
  for (const sid of set) {
    io.to(sid).emit(event, payload);
  }
}

/**
 * Autenticación sencilla en la conexión:
 * - El cliente envía { token } en socket.handshake.auth
 * - Verificamos JWT y adjuntamos socket.userId
 */
io.use((socket, next) => {
  try {
    const raw = socket.handshake.auth?.token || '';
    const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
    if (!token) return next(new Error('Falta token'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded._id;
    return next();
  } catch (e) {
    return next(new Error('Token inválido'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.userId;
  addUserSocket(userId, socket.id);
  // Útil si quieres usar "rooms" por usuario:
  socket.join(`user:${userId}`);

  // Cliente puede anunciar con quién chatea ahora (para "typing", etc.)
  socket.on('dm:typing', ({ to, typing }) => {
    if (!to) return;
    emitToUser(to, 'dm:typing', { from: userId, typing: !!typing });
  });

  // Enviar mensaje directo
  socket.on('dm:send', async ({ to, text }) => {
    try {
      if (!to || !text || !String(text).trim()) return;

      // Guardar en Mongo
      const msg = await Message.create({
        from: userId,
        to,
        text: String(text).trim(),
      });

      // Emitir a emisor y receptor
      const payload = {
        _id: msg._id,
        from: msg.from,
        to: msg.to,
        text: msg.text,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
      };
      emitToUser(userId, 'dm:new', payload);
      emitToUser(to, 'dm:new', payload);
    } catch (e) {
      console.error('dm:send error', e);
      socket.emit('dm:error', { message: 'No se pudo enviar el mensaje' });
    }
  });

  socket.on('disconnect', () => {
    removeUserSocket(userId, socket.id);
  });
});

// --- Mongo + listen ---
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

console.log('JWT_SECRET cargado:', process.env.JWT_SECRET ? '✅' : '❌ FALTA');

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });
