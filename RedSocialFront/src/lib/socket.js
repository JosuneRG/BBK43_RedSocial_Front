// src/lib/socket.js
import { io } from "socket.io-client";

let socket = null;

export function initSocket(token) {
  if (socket?.connected) return socket;

  if (socket) {
    try { socket.disconnect(); } catch {}
    socket = null;
  }

  socket = io("http://localhost:3000", {
    transports: ["websocket"],
    autoConnect: true,
    withCredentials: true,
    auth: { token },
  });

  socket.on("connect", () => console.log("[socket] conectado:", socket.id));
  socket.on("disconnect", (reason) => console.log("[socket] desconectado:", reason));
  socket.on("connect_error", (err) => console.error("[socket] connect_error:", err?.message));

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    try { socket.disconnect(); } catch {}
    socket = null;
  }
}

// 👇 Alias retro-compatible para código que importe `connectSocket`
export function connectSocket(token) {
  return initSocket(token);
}

// (Opcionales si usas DMs)
export function onDM(handler) {
  const s = getSocket();
  if (!s) return () => {};
  s.on("dm:message", handler);
  return () => s.off("dm:message", handler);
}

export function sendDM({ toUserId, text }) {
  const s = getSocket();
  if (!s) throw new Error("Socket no inicializado");
  s.emit("dm:send", { toUserId, text });
}
