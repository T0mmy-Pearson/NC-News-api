const db = require("../db/connection")


exports.selectTopics = (req, res, next) => {
    const query = `SELECT * FROM topics;`
    return db.query(query)
        .then((result) => {

        if(!result.rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found"})
        }
      return result.rows;
    });
};

exports.selectArticlesById = (article_id) => {
    const query = `SELECT * FROM articles WHERE article_id = $1;`
    const params = [article_id]
    
    return db.query(query, params)
        .then((result) => {
            if(!result.rows.length) {
                return Promise.reject({ status: 404, msg: "Not Found"})
            }
            return result.rows[0];
        })
}