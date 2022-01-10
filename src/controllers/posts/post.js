const Posts = require("../../models/posts/posts");

exports.postPosts = async (req, res) => {
  const title = req.body.title;
  const image = req.body.image;
  const content = req.body.content;
  const message = "Post have been successfully saved";
  const posts = new Posts({
    title: title,
    image: image,
    content: content,
  });
  posts = await posts.save();
  try {
    return res.status(200).json(message);
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.getPosts = async (req, res) => {
  if (Posts === null) {
    let message = "They are no post here";
  }
  var post = await Posts.find().sort({
    createdAt: "desc",
  });
  try {
    return res.status(200).json({ post: post });
  } catch (err) {
    return res.status(400).json(message);
  }
};
