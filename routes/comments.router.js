const express = require('express');
const { patchCommentVotes } = require('../app/controller');
const { deleteCommentById } = require('../app/controller');

const commentsRouter = express.Router();

commentsRouter.route('/:comment_id').patch(patchCommentVotes);
commentsRouter.route('/:comment_id').delete(deleteCommentById)

module.exports = commentsRouter;