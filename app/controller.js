const {selectTopics, selectArticlesById, selectAllArticles, selectCommentsByArticleId, insertCommentByArticleId, updateArticleById, removeCommentById, selectAllUsers, updateCommentVotes} = require('./model.js')
const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
        res.status(200).send({ endpoints });
};
exports.getAllUsers = (req, res, next) => {
        const { username } = req.params; 

        return selectAllUsers(username)
        .then((result) => {
                res.status(200).send( result );
        })
        .catch((err) => {
                next(err);
        });
}



exports.getTopics = (req, res, next) => {
    return selectTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
    .catch((err) => {
         next(err);
       })
}

exports.getArticlesById = (req, res, next) => {
        const { article_id } = req.params;
        
        return selectArticlesById(article_id)
        .then((article) => {
        res.status(200).send(article); 
        })
        .catch((err) => {
                  next(err);
                })
}

exports.getAllArticles = (req, res, next) => {
        const { sort_by, order, topic } = req.query;
        
        return selectAllArticles(sort_by, order, topic)
        .then((articles) => {
        res.status(200).send( {articles} );
        })
        .catch((err) => {
        next(err);
        })
}

exports.postCommentByArticleId = (req, res, next) => {
        const { article_id } = req.params
        const { username, body } = req.body
return insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
        res.status(201).send({ comment })
    })
    .catch((err) => {
        next(err)
        })
}
exports.getCommentsByArticleId = (req, res, next) => {
        const { article_id } = req.params;
        
        return selectCommentsByArticleId(article_id)
        .then((comments) => {
            res.status(200).json({ comments });
        })
        .catch((err) => {
            next(err);
        });
}
exports.patchArticleById = (req, res, next) => { 
        const { article_id } = req.params;
        const { inc_votes } = req.body; 

        if (inc_votes === undefined) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

        return updateArticleById(article_id, inc_votes)
                .then((updatedArticle) => {
                        res.status(200).send({ article: updatedArticle });
                }) .catch((err) => {
                        next(err);
                })
}
exports.deleteCommentById = (req, res, next) => {
        const { comment_id } = req.params;
        return removeCommentById(comment_id)
                .then(() => {
                        res.status(204).send();
                })
                .catch((err) => {
                        next(err);
                });
}

exports.patchCommentVotes = (req, res, next) => {
        const { comment_id } = req.params;
        console.log(comment_id);
        
        const { inc_votes } = req.body;

        return updateCommentVotes(comment_id, inc_votes)
            .then((updatedComment) => {
                res.status(200).send({ comment: updatedComment });
            })
            .catch((err) => {
                next(err);
            });
};
