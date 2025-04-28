const express = require("express");
const app = express();
const db = require("./db/connection");
const {getEndpoints, getTopics} = require('./app/controller')
app.use(express.json());

app.get("/api", getEndpoints);


app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
    //  console.log(err, "<<<<<middleware1", err.status, "<---err.status");
     if (err.status && err.msg) {
       res.status(err.status).send({ msg: err.msg });
     } else {
       next(err);
     }
   });
app.use((err, req, res, next) => {
      console.log(err.status, err.code, "<<<<<middleware2");
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
app.all('/*splat', (req, res) => {
        res.status(404).send({ msg: "Route not found" });
      });

module.exports = app;