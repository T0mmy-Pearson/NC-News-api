const {selectTopics, selectArticlesById} = require('./model.js')
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
        .then((result) => {
                const id = result.rows[0].article_id;
                res.status(200).send({ id: id})
        })
        .catch((err) => {
                  next(err);
                })
}