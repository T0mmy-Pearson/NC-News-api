const express = require("express");
const app = express();
const db = require("./db/connection");
const {getEndpoints} = require('./app/controller')
app.use(express.json());

app.get("/api", getEndpoints);

app.all('/*splat', (req, res) => {
    res.status(404).send({ msg: "Route not found" });
  });

module.exports = app;