const express = require("express");
const { getAllUsers } = require("../app/controller");

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getAllUsers);

module.exports = usersRouter;