const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const topicsRouter = require("./routes/topics.router");
const articlesRouter = require("./routes/articles.router");
const usersRouter = require("./routes/users.router");
const { getEndpoints, deleteCommentById } = require("./app/controller");

app.use(express.json());

app.use("/api", apiRouter);

app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/users", usersRouter);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*splat", (req, res) => {
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
  if (err.code === "22P02") {
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