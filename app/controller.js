const {selectTopics} = require('./model.js')
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
       // console.log(err.code, "<-----controller error, getTopics")
         next(err);
       })
}