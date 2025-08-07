const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../Backend/models/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { firstName, username, email, password } = req.body;

    // Validar que no exista usuario
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email ya registrado' });

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    user = new User({ firstName, username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    // Comparar password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

    // Crear payload para token
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // Firmar token JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
