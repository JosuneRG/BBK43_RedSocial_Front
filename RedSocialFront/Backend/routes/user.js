const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const usersController = require("../controllers/usersController");


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

module.exports = router;
