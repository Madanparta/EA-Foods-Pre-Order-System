import request from "supertest";
import app from "../app.js";
import { Product } from "../models/index.js";

describe("Idempotency Key", () => {
  let product;

  beforeAll(async () => {
    product = await Product.findOne();
  });

  test("should not create duplicate orders with same idempotency key", async () => {
    const key = "madan-testkey-123";
    const orderPayload = {
      customerName: "Idemp Test",
      customerType: "CUSTOMER",
      productId: product.id,
      quantity: 1,
      deliverySlot: "MORNING",
    };

    const first = await request(app)
      .post("/api/orders")
      .set("idempotency-key", key)
      .send(orderPayload);

    expect(first.status).toBe(201);

    const second = await request(app)
      .post("/api/orders")
      .set("idempotency-key", key)
      .send(orderPayload);

    expect(second.status).toBe(200);
    expect(second.body.order.orderId).toBe(first.body.order.orderId);
  });
});
