const express = require("express");
const { getAllUsers } = require("../app/controller");

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);

module.exports = usersRouter;