const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const uploadCloud = require("../configs/cloudinary.config");
const checker = require("../middlewares/checker");

router.get("/", (req, res, next) => {
  Post.find()
    .then(posts => {
      res.render("index", { posts, user: req.user });
    })
    .catch(error => next(error));
});

router.get("/post/:id", (req, res, next) => {
  const id = req.params.id;

  Post.findById(id)
    .populate("creatorId")
    .populate("comment")
    .then(post => {
      return Comment.populate(post, {
        path: "comment.authorId",
        model: User
      });
    })
    .then(post => {
      res.render("posts/show", { post, user: req.user });
    })
    .catch(error => next(error));
});

router.post("/post/:id/edit", checker.checkLogin, (req, res) => {
  Comment.create({ content: req.body.content, authorId: req.user._id })
    .then(comment => {
      Post.findByIdAndUpdate(
        req.params.id,
        { $push: { comment: comment._id } },
        { new: true }
      )
        .then(post => {
          res.redirect("back");
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get("/create", (req, res, next) => {
  res.render("posts/create");
});

router.post("/create", uploadCloud.single("picPath"), (req, res, next) => {
  const { content, picName } = req.body;
  const { url } = req.file;

  Post.create({
    picName,
    picPath: url,
    content,
    creatorId: req.user._id
  }).then(() => res.redirect("/"));
});

module.exports = router;
