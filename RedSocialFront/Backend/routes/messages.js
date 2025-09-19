const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Message = require('../models/Message');

// Historial entre el usuario autenticado y :peerId (los últimos N)
router.get('/:peerId', auth, async (req, res) => {
  try {
    const me = req.user._id;
    const peer = req.params.peerId;

    const msgs = await Message.find({
      $or: [
        { from: me, to: peer },
        { from: peer, to: me },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(200);

    res.json(msgs);
  } catch (e) {
    console.error('GET /messages/:peerId error:', e);
    res.status(500).json({ message: 'Error al obtener mensajes' });
  }
});

module.exports = router;
