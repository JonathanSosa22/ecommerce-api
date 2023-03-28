const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
require("../models");

let token;
let cartId;

beforeAll(async () => {
  const credentials = {
    email: "bot-user@gmail.com",
    password: "bot1234",
  };
  const res = await request(app).post("/api/v1/users/login").send(credentials);
  token = res.body.token;
});

test("POST /cart should create one cart", async () => {
  const product = await Product.create({
    title: "Bot Product",
    description: "Product Bot",
    price: 100,
  });
  const cart = {
    quantity: 1,
    productId: product.id,
  };
  const res = await request(app)
    .post("/api/v1/cart")
    .send(cart)
    .set("Authorization", `Bearer ${token}`);
  cartId = res.body.id;
  await product.destroy();
  expect(res.status).toBe(201);
  expect(res.body.quantity).toBe(cart.quantity);
});

test("GET /cart should return all cart", async () => {
  const res = await request(app)
    .get("/api/v1/cart")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("PUT /cart/:id should update one cart", async () => {
  const body = {
    quantity: 2,
  };
  const res = await request(app)
    .put(`/api/v1/cart/${cartId}`)
    .send(body)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.quantity).toBe(body.quantity);
});

test("DELETE /cart/:id should delete one cart", async () => {
  const res = await request(app)
    .delete(`/api/v1/cart/${cartId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
