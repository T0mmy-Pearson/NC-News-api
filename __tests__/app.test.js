const endpointsJson = require("../endpoints.json");

const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../api.js");


beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("ALL: 404: Not found", () => {
  test("404: Not Found, invalid route", () => {
    return request(app)
      .get("/apt/invalidroute") 
      .expect(404)
      .then((response) => {
      expect(response.body.msg).toBe("Route not found");
      });
  });
});
describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body: {endpoints} }) => {
        //console.log({ body: { endpoints } });
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("200: Responds with correcrt formatted data from topics", () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual({
            description: expect.any(String),
            slug: expect.any(String),
            img_url: expect.any(String),
          });
        });
    });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the correct objecy corresponding to input article_id", () => {
      return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then((response) => {
        expect(response.body.article_id).toEqual(1
        );
        expect(response.body).toEqual(
          {
            article_id: expect.any(Number),
            title: expect.any(String),
            body: expect.any(String),
            votes: expect.any(Number),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String)
          }
        )
      });
  });
  describe("ERROR PATHS GET/api/articles/:article_id", () => {
    test("400: Bad Request when a string passed instead of valid id", () => {
      return request(app)
        .get("/api/articles/tree")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
  });
  test("404: request vaild but out of range", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});
});
describe("GET /api/articles", () => {
  test("200: Responds with an array of all articles, formatted including comment count from comments table", () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const articles = body; 
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("created_at", { descending: true });


        articles.forEach((article) => {
          expect(article).not.toHaveProperty('body'); 
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String), // should be a number
            })
          );
        });
      });
  });
});
describe("ERROR PATHS GET/api/articles", () => {
  test("400: Bad Request when a string passed instead of valid id", () => {
    return request(app)
      .get("/api/articles/tree")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
describe('POST /api/articles/:article_id/comments', () => {
  test('201: Responds with the posted comment for the given article_id', () => {
      const newComment = {
          username: 'butter_bridge',
          body: 'This is a fantastic article!',
      };
      return request(app)
          .post('/api/articles/1/comments')
          .send(newComment)
          .expect(201)
          .then(({ body }) => {
              const { comment } = body;
              expect(comment).toEqual(
                  expect.objectContaining({
                      comment_id: expect.any(Number),
                      votes: 0,
                      created_at: expect.any(String),
                      author: 'butter_bridge',
                      body: 'This is a fantastic article!',
                      article_id: 1,
                  })
              );
          });
  });
describe('ERROR PATHS POST /api/articles/:article_id/comments', () => { 
  test('404: Responds with an error if article_id does not exist', () => {
    const newComment = {
        username: 'butter_bridge',
        body: 'This is a fantastic article!',
    };

    return request(app)
        .post('/api/articles/9999/comments')
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article not found');
        });
});
  test('400: Bad Request when invalid article_id is provided', () => {
      const newComment = {
          username: 'butter_bridge',
          body: 'This is a fantastic article!',
      };
      return request(app)
          .post('/api/articles/invalid_id/comments')
          .send(newComment)
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Bad Request');
          });
  });
});
});
describe('GET /api/articles/:article_id/comments', () => {
  test('200: Responds with an array of comments for the given article_id, sorted by most recent first', () => {
      return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
              const { comments } = body;
              expect(comments.length).toBe(11);
              expect(Array.isArray(comments)).toBe(true);
              expect(comments).toBeSortedBy("created_at", { descending: true });
              comments.forEach((comment) => {
              expect(comment).toEqual(
                      expect.objectContaining({
                          comment_id: expect.any(Number),
                          votes: expect.any(Number),
                          created_at: expect.any(String),
                          author: expect.any(String),
                          body: expect.any(String),
                          article_id: 1,
                      })
                  );
              });
          });
  });
  test('200: Responds with an empty array when the article exists but has no comments', () => {
    return request(app)
        .get('/api/articles/2/comments') 
        .expect(200)
        .then(({ body }) => {
            const { comments } = body;
            expect(comments).toEqual([]);
        });
});
  describe("ERROR PATHS GET /api/articles/:article_id/comments", () => {
    test('400: Responds with an error if article_id is invalid', () => {
      return request(app)
          .get('/api/articles/not-a-valid-id/comments')
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Bad Request');
          });
  });
  test('404: Responds with an error when the article_id is valid but does not exist', () => {
    return request(app)
        .get('/api/articles/9999/comments') 
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article Not Found');
        });
});
  });
});
describe('PATCH /api/articles/:article_id', () => {
  test('200: Responds with the updated article when incrementing votes', () => {
      const update = { inc_votes: 10 };
      return request(app)
          .patch('/api/articles/1')
          .send(update)
          .expect(200)
          .then(({ body }) => {
              const { article } = body;
              expect(article).toEqual(
                  expect.objectContaining({
                      article_id: 1,
                      votes: expect.any(Number),
                      author: expect.any(String),
                      title: expect.any(String),
                      body: expect.any(String),
                      topic: expect.any(String),
                      created_at: expect.any(String),
                      article_img_url: expect.any(String),
                  })
              );
              expect(article.votes).toBe(110); 
          });
  });
  test('200: Responds with the updated article when decrementing votes', () => {
      const update = { inc_votes: -50 };

      return request(app)
          .patch('/api/articles/1')
          .send(update)
          .expect(200)
          .then(({ body }) => {
              const { article } = body;

              expect(article.votes).toBe(50); 
          });
  });
  test('200: Responds with the updated article when no votes are passed', () => {
      const update = { inc_votes: 0 };

      return request(app)
          .patch('/api/articles/1')
          .send(update)
          .expect(200)
          .then(({ body }) => {
              const { article } = body;

              expect(article.votes).toBe(100); 
          });
  });

describe('ERROR PATHS PATCH /api/articles/:article_id', () => {
  test('400: Bad Request when invalid article_id is provided', () => {
      const update = { inc_votes: 10 };

      return request(app)
          .patch('/api/articles/not-a-valid-id')
          .send(update)
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Bad Request');
          });
  });

    test('404: Responds with an error if the article_id is valid but does not exist', () => {
        const update = { inc_votes: 10 };

        return request(app)
            .patch('/api/articles/9999') 
            .send(update)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
            });
    });

    test('400: Responds with an error if the type of inc_votes is not a number', () => {
        const update = { inc_votes: 'ten' }; 

        return request(app)
            .patch('/api/articles/1') 
            .send(update)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            });
    });

    test('400: Responds with an error if the body is missing the required keys (inc_votes)', () => {
        const update = {}; 

        return request(app)
            .patch('/api/articles/1') 
            .send(update)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            });
    });
});
});
describe('DELETE /api/comments/:comment_id', () => {
  test('204: Deletes the given comment by comment_id and responds with no content', () => {
      return request(app)
          .delete('/api/comments/1')
          .expect(204)
          .then(() => {
              return db.query('SELECT * FROM comments WHERE comment_id = 1;');
          })
          .then((result) => {
              expect(result.rows.length).toBe(0); 
          });
  });
describe('ERROR PATHS DELETE /api/comments/:comment_id', () => {
  test('400: Responds with an error if comment_id is invalid', () => {
      return request(app)
          .delete('/api/comments/not-a-valid-id')
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Bad Request');
          });
  });
});
});
describe('GET /api/users', () => {
  test('200: Responds with array of user objects', () => {
      return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body }) => {
              const { users } = body;
              expect(users.length).toBe(4); 
              users.forEach((user) => {
                  expect(user).toEqual(
                      expect.objectContaining({
                          username: expect.any(String),
                          name: expect.any(String),
                          avatar_url: expect.any(String),
                      })
                  );
              });
          });
  });
  //error path: 400 request, help desk
});
describe('GET /api/articles (sorting queries)', () => {
  test('200: Sorts default column created_at and in descending order by default', () => {
      return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
              expect(body).toBeSortedBy("created_at", { descending: true });
          });
  });
test('200: correct data types and properties in output', () => {
  return request(app)
      .get('/api/articles?sort_by=votes&order=asc')
      .expect(200)
      .then(({ body }) => {
          const articles = body;
          articles.forEach((article) => {
              expect(article).toEqual(
                  expect.objectContaining({
                      article_id: expect.any(Number),
                      title: expect.any(String),
                      author: expect.any(String),
                      topic: expect.any(String),
                      created_at: expect.any(String),
                      votes: expect.any(Number),
                      article_img_url: expect.any(String),
                      comment_count: expect.any(String),
                  })
              );
          });
      });
});
});

describe('GET /api/articles (topic query)', () => {
  test('200: Filters articles by a valid topic', () => {
      return request(app)
          .get('/api/articles?topic=coding')
          .expect(200)
          .then(({ body }) => {
              const articles  = body;
              articles.forEach((article) => {
                  expect(article.topic).toBe('coding');
              });
          });
  });
  test('200: Responds with an empty array if the topic exists but has no articles', () => {
    return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({ body }) => {
            expect(body).toEqual([]);
        });
});
test('200: Responds with all articles if the topic query is omitted', () => {
  return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
          const articles  = body;
          expect(articles.length).toBeGreaterThan(0);
      });
});
});