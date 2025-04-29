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
exports.selectCommentsByArticleId = (article_id) => {
    const query = `
        SELECT 
            comment_id,
            votes,
            created_at,
            author,
            body,
            article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
    `;
    const params = [article_id];

    return db.query(query, params)
        .then((result) => {
            return result.rows;
        });
};

exports.insertCommentByArticleId = (article_id, username, body) => {

    const articleCheckQuery = `SELECT * FROM articles WHERE article_id = $1;`;

    return db.query(articleCheckQuery, [article_id])
        .then((result) => {
            if (!result.rows.length) {
                return Promise.reject({ status: 404, msg: "Article not found" });
            }
            const query = `
                INSERT INTO comments (article_id, author, body, created_at, votes)
                VALUES ($1, $2, $3, NOW(), 0)
                RETURNING comment_id, votes, created_at, author, body, article_id;
            `;
            return db.query(query, [article_id, username, body]);
        })
        .then((result) => {
            return result.rows[0]; 
        });
};
exports.updateArticleById = (article_id, inc_votes) => {
    const query = `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
    `;
    const params = [inc_votes, article_id];

    return db.query(query, params)
        .then((result) => {
            if (!result.rows.length) {
                return Promise.reject({ status: 404, msg: "Article not found" });
            }
            return result.rows[0];
        });
};