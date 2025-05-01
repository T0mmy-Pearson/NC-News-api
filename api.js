const express = require("express");
const app = express();
const {getEndpoints, getTopics, getArticlesById, getAllArticles, postCommentByArticleId, getCommentsByArticleId, patchArticleById, deleteCommentById, getAllUsers} = require('./app/controller')
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticlesById)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.get('/api/users', getAllUsers);

app.post("/api/articles/:article_id/comments",postCommentByArticleId);

app.patch('/api/articles/:article_id', patchArticleById);

app.delete('/api/comments/:comment_id', deleteCommentById);



app.all('/*splat', (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});
app.use((err, req, res, next) => {
     if (err.status && err.msg) {
      //console.log(err, "err catcher 1");
      
       res.status(err.status).send({ msg: err.msg });
     } else {
       next(err);
     }
   });
app.use((err, req, res, next) => {
      if ((err.code = "22P02")) {
        res.status(400).send({ msg: "Bad Request" });
      } else {
        next(err);
      }
    });
app.use((err, req, res, next) => {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
      });

module.exports = app;