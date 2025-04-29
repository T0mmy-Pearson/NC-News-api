const express = require("express");
const app = express();
const db = require("./db/connection");
const {getEndpoints, getTopics, getArticlesById, getAllArticles, postCommentByArticleId} = require('./app/controller')
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticlesById)

app.post("/api/articles/:article_id/comments",postCommentByArticleId )




app.all('/*splat', (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});
app.use((err, req, res, next) => {
     if (err.status && err.msg) {
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