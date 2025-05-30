const db = require("../connection")
const { Pool } = require('pg');
const format = require('pg-format');
const {convertTimestampToDate, createArticlesLookupObj} = require("./utils")


const seed = (data) => {
  const { topicData, userData, articleData, commentData } = data;

  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => db.query(`DROP TABLE IF EXISTS articles;`))
    .then(() => db.query(`DROP TABLE IF EXISTS users;`))
    .then(() => db.query(`DROP TABLE IF EXISTS topics;`))
    .then(() =>
      db.query(`
        CREATE TABLE topics (
          slug VARCHAR PRIMARY KEY,
          description VARCHAR NOT NULL,
          img_url VARCHAR(1000) NOT NULL
        );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE users (
          username VARCHAR PRIMARY KEY,
          name VARCHAR NOT NULL,
          avatar_url VARCHAR(1000)
        );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          topic VARCHAR REFERENCES topics(slug),
          author VARCHAR REFERENCES users(username),
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000)
        );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          article_id INT REFERENCES articles(article_id),
          body TEXT NOT NULL,
          votes INT DEFAULT 0,
          author VARCHAR REFERENCES users(username),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `)
    )
    .then(() => {
      const insertTopics = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`,
        topicData.map(({ slug, description, img_url }) => [slug, description, img_url])
      );
      return db.query(insertTopics);
    })
    .then(() => {
      const insertUsers = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
        userData.map(({ username, name, avatar_url }) => [username, name, avatar_url])
      );
      return db.query(insertUsers);
    })
    .then(() => {
      const formattedArticles = articleData.map(
        ({ title, topic, author, body, created_at, votes, article_img_url }) => [
          title,
          topic,
          author,
          body,
          new Date(created_at).toISOString(), // ISO 8601
          votes,
          article_img_url,
        ]
      );
      const insertArticles = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
        formattedArticles
      );
      return db.query(insertArticles);
    })
    .then((result) => {
      const articlesLookUp = createArticlesLookupObj(result.rows)
      const formattedComments = commentData.map((comment) => {
      const legitComment = convertTimestampToDate(comment)
      //console.log(articlesLookUp);
        
          return [
          articlesLookUp[legitComment.article_title],
          legitComment.body,
          legitComment.votes,
          legitComment.author,
          legitComment.created_at
        ]
    });
    //console.log(formattedComments);
    
      const insertComments = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *;`,
        formattedComments
      );
     // console.log(formattedComments);
      
      return db.query(insertComments);
    })
    .then(() => {
      //console.log('Database seeded successfully!');
    })
    .catch((err) => {
      console.error('Error during seeding:', err);
    });
};

module.exports = seed;