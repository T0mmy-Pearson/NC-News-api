const {selectTopics, selectArticlesById, selectAllArticles, insertCommentByArticleId} = require('./model.js')
const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
        res.status(200).send({ endpoints });
};

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
        return selectAllArticles()
        .then((articles) => {
        res.status(200).send( articles );
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
