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
describe("GET /api/articles", () => {
  test("200: Responds with array of all articles, formatted including comment count from comments table", () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response) => {
      const articles  = response.body;
        
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(13); 

      expect(articles).toBeSortedBy("created_at", { descending: true });

      articles.forEach((article) => {
      expect(article).not.toHaveProperty('body');
      });
      articles.forEach((article) => {
      expect(article).toEqual(
      expect.objectContaining({
      author: expect.any(String),
      title: expect.any(String),
      article_id: expect.any(Number),
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
describe("404: Not found", () => {
  test("404: Not Found, invalid route", () => {
    return request(app)
      .get("/apt/invalidroute") 
      .expect(404)
      .then((response) => {
      expect(response.body.msg).toBe("Route not found");
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