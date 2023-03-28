const request = require("supertest");
const app = require("../app");

let userId;
let token;

test("POST /users should create a user", async () => {
  const newUser = {
    firstName: "Bot",
    lastName: "Api",
    email: "bot-api@gmail.com",
    password: "bot1234",
    phone: "1122334455",
  };
  const res = await request(app).post("/api/v1/users").send(newUser);
  userId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.email).toBe(newUser.email);
});

test("POST /users/login should do login", async () => {
  const user = {
    email: "bot-api@gmail.com",
    password: "bot1234",
  };
  const res = await request(app).post("/api/v1/users/login").send(user);
  token = res.body.token;
  expect(res.status).toBe(200);
  expect(res.body.user.email).toBe(user.email);
  expect(res.body.token).toBeDefined();
});

test("POST /users/login with invalid credentials should return 401", async () => {
  const user = {
    email: "bot-api@gmail.com",
    password: "wronpassword",
  };
  const res = await request(app).post("/api/v1/users/login").send(user);
  expect(res.status).toBe(401);
});

test("GET /users should return all users", async () => {
  const res = await request(app)
    .get("/api/v1/users")
    .set("authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(2);
});

test("PUT /users/:id should update one user", async () => {
  const body = {
    firstName: "Bot Update",
  };
  const res = await request(app)
    .put(`/api/v1/users/${userId}`)
    .send(body)
    .set("authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.firstName).toBe(body.firstName);
});

test("DELETE /users/:id should delte one user", async () => {
  const res = await request(app)
    .delete(`/api/v1/users/${userId}`)
    .set("authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
