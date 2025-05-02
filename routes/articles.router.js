const express = require("express");
const {
  getArticlesById,
  getAllArticles,
  postCommentByArticleId,
  getCommentsByArticleId,
  patchArticleById,
} = require("../app/controller");

const articlesRouter = express.Router();

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticlesById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postCommentByArticleId);
articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter;