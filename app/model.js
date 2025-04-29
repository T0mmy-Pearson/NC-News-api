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

exports.selectAllArticles = () => {
    const query = `SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`

return db.query(query)
    .then((result) => {
        return result.rows;
    })
};
