// routes/notifications.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const webpush = require('../webpush');

// Guarda la subscription en tu User o colección aparte
const User = require('../models/User');

router.post('/subscribe', auth, async (req, res) => {
  try {
    const sub = req.body; // { endpoint, keys }
    await User.findByIdAndUpdate(req.user._id, { $set: { pushSub: sub } });
    res.status(201).json({ message: 'Suscripción guardada' });
  } catch (e) {
    console.error(e); res.status(500).json({ message: 'Error guardando sub' });
  }
});

// Ejemplo enviar notificación a 1 usuario
router.post('/notify/me', auth, async (req, res) => {
  try {
    const me = await User.findById(req.user._id);
    if (!me?.pushSub) return res.status(400).json({ message: 'Sin suscripción' });
    await webpush.sendNotification(me.pushSub, JSON.stringify({
      title: '¡Tienes novedades!',
      body: req.body?.body || 'Nueva actividad en tu red social',
      url: '/' // a dónde abre
    }));
    res.json({ ok: true });
  } catch (e) {
    console.error(e); res.status(500).json({ message: 'Error enviando push' });
  }
});

module.exports = router;
