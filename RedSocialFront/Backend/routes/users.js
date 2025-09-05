const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const usersController = require("../controllers/usersController");
const User = require('../models/User');

//1 - REGISTRO de usuario (NO requiere autenticación)
// http://localhost:3001/users/register
router.post("/register", usersController.register);

//2 - LOGIN (NO requiere autenticación)
// http://localhost:3001/users/login
router.post("/login", usersController.login);

//3 - PERFIL del usuario autenticado (requiere token)
// http://localhost:3001/users/getProfile
router.get("/getProfile", auth, usersController.getProfile);

//4 - LOGOUT del usuario autenticado (requiere token)
// http://localhost:3001/users/logout
router.get("/logout", auth, usersController.logout);

router.get("/search/:q", async (req, res) => {
  try {
    const q = req.params.q || '';
    const regex = new RegExp(q, 'i');
    const users = await User.find({ username: regex }, { password: 0 })
      .limit(20)
      .sort({ username: 1 });
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al buscar usuarios' });
  }
});

module.exports = router;
