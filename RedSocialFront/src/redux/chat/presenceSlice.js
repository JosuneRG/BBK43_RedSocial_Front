// src/redux/chat/presenceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineMap: {},      // { [userId]: true/false }
  typingMap: {},      // { [roomId]: { [userId]: true } }
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    setOnline(state, action) {
      const { userId, online } = action.payload;
      state.onlineMap[userId] = !!online;
    },
    setManyOnline(state, action) {
      // opcional: para una lista inicial
      const list = action.payload || [];
      list.forEach((uId) => { state.onlineMap[uId] = true; });
    },
    setOffline(state, action) {
      const userId = action.payload;
      state.onlineMap[userId] = false;
    },
    setTyping(state, action) {
      const { roomId, userId, typing } = action.payload;
      if (!state.typingMap[roomId]) state.typingMap[roomId] = {};
      state.typingMap[roomId][userId] = !!typing;
    },
    clearTyping(state, action) {
      const { roomId } = action.payload;
      delete state.typingMap[roomId];
    },
  },
});

export const { setOnline, setManyOnline, setOffline, setTyping, clearTyping } =
  presenceSlice.actions;
export default presenceSlice.reducer;
