const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const postController = require("../controllers/postsController");

// 1 - Crear un post (requiere autenticación)
// POST -- http://localhost:3001/posts
// Ejemplo:
// {
//   "title": "Título del post",
//   "content": "Contenido del post",
// }
router.post("/", auth, postController.create);

// 2 - Actualizar un post (requiere autenticación)
// PUT -- http://localhost:3001/posts/<postId>
// {
//   "title": "Nuevo título",
//   "content": "Nuevo contenido"
// }
router.put("/:id", auth, postController.update);

// 3 - N - Eliminar un post (requiere autenticación)
// http://localhost:3001/posts/:id
router.delete("/:id", auth, postController.delete);

// 4 - Obtener todos los posts con usuarios y comentarios (público)
// http://localhost:3001/posts
router.get("/", postController.getAll);

// 5 - N - Buscar posts por nombre (público)
//GET - http://localhost:3001/posts/search/:name
router.get("/search/:name", postController.getPostsByName);

// 6 - Buscar post por ID (público)
//GET - http://localhost:3001/posts/id/:id
router.get("/id/:id", postController.getById);

// 7 - Obtener posts paginados (público)
//GET - http://localhost:3001/posts/paginated
router.get("/paginated", postController.getPaginated);

// 8 - N - Dar like a un post (requiere autenticación)
//GET - http://localhost:3001/posts/:id/like
router.post("/:id/like", auth, postController.like);

// 9 - N - Quitar like de un post (requiere autenticación)
//GET - http://localhost:3001/posts/:id/unlike
router.post("/:id/unlike", auth, postController.unlike);

//10- ver todos los posts
//GET - http://localhost:3001/posts/getAllPosts
router.get("/getAllPosts", postController.getAll);

module.exports = router;