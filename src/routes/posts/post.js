const express = require("express");
const isAuth = require("../../config/is-auth");

const postController = require("../../controllers/posts/post");

const router = express.Router();

router.post("/", postController.postPosts);
router.get("/", postController.getPosts);

module.exports = router;
