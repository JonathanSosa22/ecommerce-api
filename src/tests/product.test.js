const request = require("supertest");
const app = require("../app");
const ProductImg = require("../models/ProductImg");
require("../models");

let token;
let productId;

beforeAll(async () => {
  const credentials = {
    email: "bot-user@gmail.com",
    password: "bot1234",
  };
  const res = await request(app).post("/api/v1/users/login").send(credentials);
  token = res.body.token;
});

test("POST /products should create one product", async () => {
  const newProduct = {
    title: "Bot Product",
    description: "Product Bot",
    price: 100,
  };
  const res = await request(app)
    .post("/api/v1/products")
    .send(newProduct)
    .set("Authorization", `Bearer ${token}`);
  productId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.title).toBe(newProduct.title);
});

test("GET /products should return all products", async () => {
  const res = await request(app).get("/api/v1/products");
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("POST /products/:id/images should set the product images", async () => {
  const image = await ProductImg.create({ url: "UrlImage", publicId: "Image" });
  const res = await request(app)
    .post(`/api/v1/products/${productId}/images`)
    .send([image.id])
    .set("Authorization", `Bearer ${token}`);
  await image.destroy();
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("PUT /products/:id should update one product", async () => {
  const body = {
    title: "Bot Product Update",
  };
  const res = await request(app)
    .put(`/api/v1/products/${productId}`)
    .send(body)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.title).toBe(body.title);
});

test("DELETE /products/:id should delte one product", async () => {
  const res = await request(app)
    .delete(`/api/v1/products/${productId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
