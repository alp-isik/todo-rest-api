const request = require("supertest");
const app = require("../app");
const db = require("../models");

let token;
let createdTodoId;
let createdCategoryId;
const testEmail = `testuser_${Date.now()}@test.com`;
const testPassword = "test123";

beforeAll(async () => {
  await db.sequelize.sync({ alter: true });

  // Seed statuses if not already there
  const STATUSES = ["Not Started", "Started", "Completed", "Deleted"];
  for (const status of STATUSES) {
    await db.Status.findOrCreate({ where: { status } });
  }

  // Register test user
  await request(app)
    .post("/users/signup")
    .send({ name: "Test User", email: testEmail, password: testPassword });

  // Login and grab token
  const loginRes = await request(app)
    .post("/users/login")
    .send({ email: testEmail, password: testPassword });

  token = loginRes.body.data.result.token;

  // Create a category so we don't hardcode CategoryId: 1
  const catRes = await request(app)
    .post("/category")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Test Category" });

  createdCategoryId = catRes.body.data.result.id;
});

afterAll(async () => {
  // Clean up everything the test user created
  const user = await db.User.findOne({ where: { email: testEmail } });
  if (user) {
    await db.Todo.destroy({ where: { UserId: user.id } });
    await db.Category.destroy({ where: { UserId: user.id } });
    await db.User.destroy({ where: { id: user.id } });
  }
  await db.sequelize.close();
});

// Test 1 - get all todos with valid token
test("Get all todos with valid token", async () => {
  const res = await request(app)
    .get("/todos")
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body.status).toBe("success");
});

// Test 2 - add a new todo
test("Add a new todo", async () => {
  const res = await request(app)
    .post("/todos")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Test Todo",
      description: "Test description",
      CategoryId: createdCategoryId,
      StatusId: 1,
    });

  expect(res.status).toBe(201);
  expect(res.body.status).toBe("success");

  createdTodoId = res.body.data.result.id;
});

// Test 3 - delete the created todo
test("Delete the created todo", async () => {
  const res = await request(app)
    .delete(`/todos/${createdTodoId}`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body.status).toBe("success");
});

// Test 4 - get todos without token
test("Get todos without token", async () => {
  const res = await request(app).get("/todos");

  expect(res.status).toBe(401);
  expect(res.body.status).toBe("fail");
});

// Test 5 - get todos with invalid token
test("Get todos with invalid token", async () => {
  const res = await request(app)
    .get("/todos")
    .set("Authorization", "Bearer invalidtokenhere");

  expect(res.status).toBe(401);
  expect(res.body.status).toBe("fail");
});
