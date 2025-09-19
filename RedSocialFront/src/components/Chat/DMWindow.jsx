import React, { useEffect, useRef, useState } from 'react';
import useSocket from '../../hooks/useSocket';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

const DMWindow = ({ peer, onClose }) => {
  // peer: {_id, username, avatar}
  const socket = useSocket(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const viewportRef = useRef(null);

  // Cargar historial
  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE}/messages/${peer._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      if (mounted) setMessages(res.data || []);
      scrollBottom();
    }).catch(e => console.error(e));
    return () => { mounted = false; };
    // eslint-disable-next-line
  }, [peer?._id]);

  // Subir auto-scroll
  const scrollBottom = () => {
    setTimeout(() => {
      const el = viewportRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    }, 0);
  };

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    const onNew = (msg) => {
      if (msg.from === peer._id || msg.to === peer._id) {
        setMessages((prev) => [...prev, msg]);
        scrollBottom();
      }
    };
    socket.on('dm:new', onNew);
    return () => {
      socket.off('dm:new', onNew);
    };
  }, [socket, peer?._id]);

  const send = () => {
    const txt = text.trim();
    if (!txt) return;
    socket?.emit('dm:send', { to: peer._id, text: txt });
    setText('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); send();
    } else {
      socket?.emit('dm:typing', { to: peer._id, typing: true });
    }
  };

  return (
    <div className="dm-window">
      <div className="dm-header">
        <div className="left">
          <img src={peer.avatar ? `${API_BASE}/${peer.avatar}` : 'https://i.ibb.co/2kR8Yqr/default-avatar.png'} alt="" />
          <strong>@{peer.username}</strong>
        </div>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="dm-messages" ref={viewportRef}>
        {messages.map(m => (
          <div key={m._id} className={`bubble ${m.to === peer._id ? 'me' : 'them'}`}>
            <p>{m.text}</p>
            <span className="time">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ))}
      </div>

      <div className="dm-input">
        <textarea
          placeholder="Escribe un mensaje…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
        />
        <button onClick={send}>Enviar</button>
      </div>
    </div>
  );
};

export default DMWindow;
