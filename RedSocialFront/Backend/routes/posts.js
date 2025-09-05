const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { PostsController } = require('../controllers/postsController');
const multer = require("multer");
const path = require("path");

// Multer
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

// Crear / actualizar con imagen
router.post('/', auth, upload.single('image'), PostsController.create);
router.put('/:id', auth, upload.single('image'), PostsController.update);

// Eliminar
router.delete("/:id", auth, PostsController.delete);

// Listado y búsquedas
router.get("/", PostsController.getAll);
router.get("/search/:name", PostsController.getPostsByName);

// Detalle por id (ambas rutas soportadas)
router.get("/:id", PostsController.getById);        // ← añadida para front
router.get("/id/:id", PostsController.getById);

// Paginación
router.get("/paginated", PostsController.getPaginated);

// Likes
router.post("/:id/like", auth, PostsController.like);
router.post("/:id/unlike", auth, PostsController.unlike);

// Duplicada de getAll (si no la usas, puedes quitarla)
router.get("/getAllPosts", PostsController.getAll);

module.exports = router;
