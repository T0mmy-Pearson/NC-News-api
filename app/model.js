const db = require("../db/connection")
const checkTopicExists = require('./utils.models')


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
    const query = `
        SELECT 
            articles.article_id,
            articles.title,
            articles.body,
            articles.votes,
            articles.topic,
            articles.author,
            articles.created_at,
            articles.article_img_url,
            (
                SELECT COUNT(*) 
                FROM comments 
                WHERE comments.article_id = articles.article_id
            ) AS comment_count
        FROM articles
        WHERE articles.article_id = $1;
    `
    const params = [article_id]
    
    return db.query(query, params)
        .then((result) => {
            if(!result.rows.length) {
                return Promise.reject({ status: 404, msg: "Not Found"})
            }
            return result.rows[0];
        })
}
exports.selectAllArticles = (sort_by = 'created_at', order = 'desc', topic) => {
    const validSortColumns = [
        'article_id',
        'title',
        'author',
        'votes',
        'created_at',
        'topic',
        'comment_count'
    ];
    const validOrder = ['asc', 'desc'];

    if (!validSortColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort_by column' });
    }
    if (!validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query' });
    }

    let baseQuery = `
        SELECT 
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comments.comment_id)::TEXT AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
    `;
    const queryArgs = [];


    if (topic) {
        baseQuery += ` WHERE articles.topic = $1`;
        queryArgs.push(topic);
    }

    baseQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

    if (topic) {
        const topicCheckQuery = `SELECT * FROM topics WHERE slug = $1;`;
        return db.query(topicCheckQuery, [topic])
            .then((result) => { 
                if (!result.rows.length) {
                    return Promise.reject({ status: 404, msg: 'invalid topic' });
                }
                return db.query(baseQuery, queryArgs);
            })
            .then((result) => {
                return result.rows;
            });
    }

   return db.query(baseQuery, queryArgs).then((result) => {
        return result.rows;
    });
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
            if (!result.rows.length) {
                const query = `
                    SELECT * FROM articles WHERE article_id = $1;
                `;
                return db.query(query, params)
                    .then((articleResult) => {
                        if (!articleResult.rows.length) {
                            return Promise.reject({ status: 404, msg: "Article Not Found" });
                        }

                        return []; 
                    });
                }
        return result.rows;
});
}

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
exports.removeCommentById =  (comment_id) => {
    const query = `
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;
    `;
return db.query(query, [comment_id])
    .then((result) => {
        if (!result.rows.length) {
            throw { status: 404, msg: 'Comment not found' };
        }
        return result.rows[0];
    });
}
exports.selectAllUsers = () => {
    const query = `SELECT * FROM users;`
    return db.query(query)
        .then((result) => {
            if (!result.rows.length) {
                throw { status: 404, msg: 'User not found' };
            }
            return result.rows;
        })
}



