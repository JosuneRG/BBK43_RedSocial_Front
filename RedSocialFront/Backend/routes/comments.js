const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth');
const commentsController = require('../controllers/commentsController');

//Post - N _ http://localhost:3001/posts/68599f3f8cfcd1de2d85fdf8/comments
router.post('/:postId', auth, commentsController.commentPost);

module.exports = router;