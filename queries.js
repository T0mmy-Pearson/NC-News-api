const db = require('./db/connection'); 

// users
const getAllUsers = () => {
  return db.query('SELECT * FROM users;').then((result) => result.rows);
};

//  topic is 'coding'
const getArticlesByTopic = (topic) => {
  return db
    .query('SELECT * FROM articles WHERE topic = $1;', [topic])
    .then((result) => result.rows);
};

// comments where votes are less than zero
const getCommentsWithNegativeVotes = () => {
  return db
    .query('SELECT * FROM comments WHERE votes < 0;')
    .then((result) => result.rows);
};

// all topics
const getAllTopics = () => {
  return db.query('SELECT * FROM topics;').then((result) => result.rows);
};

// articles by a specific user
const getArticlesByUser = (username) => {
  return db
  // $1 is ref for first argument passed in, so $1 = username
    .query('SELECT * FROM articles WHERE author = $1;', [username])
    .then((result) => result.rows);
};

// comments more than 10 votes
const getCommentsWithMoreThan10Votes = () => {
  return db
    .query('SELECT * FROM comments WHERE votes > 10;')
    .then((result) => result.rows);
};



  Promise.all([
    getAllUsers(),
    getArticlesByTopic('coding'),
    getCommentsWithNegativeVotes(),
    getAllTopics(),
    getArticlesByUser('grumpy19'),
    getCommentsWithMoreThan10Votes(),
  ])   
  
  .then(([users, articlesByTopic, negativeComments, topics,     articlesByUser, popularComments]) => {
    // console.log('All Users:', users);
   // console.log('Articles with topic "coding":', articlesByTopic);
   // console.log('Comments with negative votes:', negativeComments);
    console.log('All Topics:', topics);
    //console.log('Articles by user "grumpy19":', articlesByUser);
    //console.log('Comments with more than 10 votes:', popularComments);
  })
  .catch((err) => {
    console.error('Error executing queries:', err);
  })
  .finally(() => {
    db.end(); // Close the database connection
  });