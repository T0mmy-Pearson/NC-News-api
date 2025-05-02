# Northcoders News API

Hello! Welcome to Tommy's Northcoders News API. It's a RESTful API designed to show the backend functionality for a Reddit-style news application. It allows users to interact with articles, topics, comments, and users, offering a wide range of features such as retrieving articles, posting comments, and more.

You can access the hosted version of the API [here](https://northcoders-news-llke.onrender.com/api).

---

## Project Summary

The Northcoders' News API is a portfolio project, built using Node.js, Express.js, and PostgreSQL, aimed at demonstrating backend development. The API follows RESTful principles, and extensive testing has been carried out to ensure a robust and reliable codebase. Users can access various endpoints to retrieve, create, update, and delete data related to articles, comments, topics, and users.

---

## Getting Started

### Prerequisites

Before cloning the project, ensure you have the following installed:

- **Node.js**: Minimum version `v18.0.0`
- **PostgreSQL**: Minimum version `v14.0`

### Cloning the Repository

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/T0mmy-Pearson/northcoders-news-api.git
   ```

2. Navigate to the project directory:
   ```bash
   cd northcoders-news-api
   ```

### Installing Dependencies

Install dependencies by running:
```bash
npm install
```

### Setting Up Environment Variables

You will need to create two `.env` files in the root directory to configure your local PostgreSQL database:

1. **`.env.development`**:
   ```
   PGDATABASE=nc_news
   ```

2. **`.env.test`**:
   ```
   PGDATABASE=nc_news_test
   ```

> **Note**: Replace `nc_news` and `nc_news_test` with your actual database names if they differ.

### Seeding the Local Database

Seed your local database with the following command:
```bash
npm run setup-dbs && npm run seed
```

### Running the Tests

To ensure everything is working as expected, run the test suite:
```bash
npm test
```

---

## API Endpoints

You can explore the available API endpoints using tools like Postman or by visiting the hosted version. Some key endpoints include:

- `GET /api/topics`: Retrieve a list of all topics.
- `GET /api/articles`: Retrieve a list of all articles.
- `GET /api/articles/:article_id`: Retrieve a specific article by ID.
- `POST /api/articles/:article_id/comments`: Add a comment to an article.
- `PATCH /api/articles/:article_id`: Update an article's vote count.

---

## Minimum Requirements

- **Node.js**: `v18.0.0` or higher
- **PostgreSQL**: `v14.0` or higher

---

Enjoy! 🌍

supabase - zT&@Tv*j$+Zt3zM