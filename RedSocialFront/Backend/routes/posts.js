const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { PostsController } = require('../controllers/postsController');
const multer = require("multer");
const path = require("path");

// Multer: subir imágenes a /Backend/img
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '..', 'img'));
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

/**
 * IMPORTANTE: el orden de las rutas cuenta.
 * Rutas "fijas" como /me y /user/:userId deben ir ANTES de "/:id"
 */

// Crear y actualizar (con imagen) — requieren auth
router.post('/', auth, upload.single('image'), PostsController.create);
router.put('/:id', auth, upload.single('image'), PostsController.update);

// Eliminar — requiere auth
router.delete("/:id", auth, PostsController.delete);

// Listado general y búsquedas públicas
router.get("/", PostsController.getAll);
router.get("/search/:name", PostsController.getPostsByName);

// NUEVOS: posts por usuario y mis posts (requiere auth para /me)
router.get("/user/:userId", PostsController.getByUser);
router.get("/me", auth, PostsController.getMine);

// Paginación pública
router.get("/paginated", PostsController.getPaginated);

// Likes — requieren auth
router.post("/:id/like", auth, PostsController.like);
router.post("/:id/unlike", auth, PostsController.unlike);

// Detalle por id (ambas rutas soportadas)
router.get("/id/:id", PostsController.getById);
router.get("/:id", PostsController.getById);

// (Opcional) duplicada de getAll si la usabas
router.get("/getAllPosts", PostsController.getAll);

module.exports = router;
