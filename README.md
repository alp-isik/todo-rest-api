# Todo REST API

A REST API built with Express.js and MySQL for managing todo items. Users can register, login, and manage their own todos and categories.

## Tech Stack

- Node.js / Express.js / Sequelize / MySQL
- JWT Authentication
- Swagger UI / Jest / Supertest

## Setup

1. Clone the repository and install dependencies: npm install

2. Create a .env file in the project root with the following values:
   HOST,
   ADMIN_USERNAME,
   ADMIN_PASSWORD,
   DATABASE_NAME,
   DIALECT, PORT,
   TOKEN_SECRET

3. Create the database in MySQL:

CREATE DATABASE myTodo;

4. Start the application: npm start

Tables and statuses are created automatically on first run.

## Authentication

All endpoints except /users/signup and /users/login require a JWT token in the request header:

Authorization: Bearer your-token-here

## Endpoints

| Method | Endpoint        | Description                     | Auth |
| ------ | --------------- | ------------------------------- | ---- |
| POST   | /users/signup   | Register a new user             | No   |
| POST   | /users/login    | Login and receive JWT token     | No   |
| GET    | /todos          | Get all non-deleted todos       | Yes  |
| GET    | /todos/all      | Get all todos including deleted | Yes  |
| GET    | /todos/deleted  | Get only deleted todos          | Yes  |
| GET    | /todos/statuses | Get all statuses                | Yes  |
| POST   | /todos          | Create a new todo               | Yes  |
| PUT    | /todos/:id      | Update a todo                   | Yes  |
| DELETE | /todos/:id      | Soft delete a todo              | Yes  |
| GET    | /category       | Get all categories              | Yes  |
| POST   | /category       | Create a new category           | Yes  |
| PUT    | /category/:id   | Update a category               | Yes  |
| DELETE | /category/:id   | Delete a category               | Yes  |

## Docs

Swagger documentation is available at http://localhost:3000/doc

## Tests

Run the test suite with: npm test
