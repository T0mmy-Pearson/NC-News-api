const express = require("express");
const app = express();
const db = require("./db/connection");
const {getEndpoints} = require('./app/controller')
app.use(express.json());

app.get("/api", getEndpoints);

app.all('/*splat', ()=>{})

module.exports = app;