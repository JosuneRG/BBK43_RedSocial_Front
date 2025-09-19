// src/App.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOnline, setOffline, setTyping } from "./redux/chat/presenceSlice";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./components/Login";
import Profile from "./pages/Profile";
import PostDetail from "./components/Posts/PostDetail";
import Search from "./components/Search";
import Footer from "./components/Footer";
import CreatePost from "./components/Posts/CreatePost";
import PrivateRoute from "./routes/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// 👇 Importa socket y funciones reales
import { socket, initSocket, disconnectSocket } from "./lib/socket";

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user && token) {
      // conecta socket con auth
      initSocket(token);

      // listeners de presencia y typing
      const onUserOnline = (data) =>
        dispatch(setOnline({ userId: data.userId, online: true }));
      const onUserOffline = (data) => dispatch(setOffline(data.userId));
      const onTyping = ({ roomId, userId, typing }) =>
        dispatch(setTyping({ roomId, userId, typing }));

      socket.on("presence:online", onUserOnline);
      socket.on("presence:offline", onUserOffline);
      socket.on("chat:typing", onTyping);

      socket.on("presence:online-list", (ids) => {
        dispatch({ type: "presence/setManyOnline", payload: ids });
      });

      return () => {
        socket.off("presence:online", onUserOnline);
        socket.off("presence:offline", onUserOffline);
        socket.off("chat:typing", onTyping);
        disconnectSocket(); // 👈 cleanup
      };
    } else {
      // si no hay login, corta socket
      disconnectSocket();
    }
  }, [user, token, dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/search/:postName" element={<Search />} />
        <Route path="/search" element={<Search />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protegida */}
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
