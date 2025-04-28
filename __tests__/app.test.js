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
describe("error paths for /api/topics", () => {
    test("404: Not Found, invalid route", () => {
      return request(app)
        .get("/apt/invalidroute") 
        .expect(404)
        .then((response) => {
        expect(response.body.msg).toBe("Route not found");
        });
    });
  });
