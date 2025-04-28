const express = require("express");
const app = express();
const db = require("./db/connection");
const controller = require('./app/controller')
app.use(express.json());



app.all('/*splat', ()=>{})

module.exports = app;