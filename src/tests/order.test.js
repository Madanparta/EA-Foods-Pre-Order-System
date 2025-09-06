import request from "supertest";
import app from "../app.js";
import { Product } from "../models/index.js";

describe("Order API - Stock check", () => {
  let product;

  beforeAll(async () => {
    product = await Product.findOne();
  });

  test("should reject order if stock is insufficient", async () => {
    const res = await request(app).post("/api/orders").send({
      customerName: "Test User",
      customerType: "CUSTOMER",
      productId: product.id,
      quantity: product.currentStock + 10,
      deliverySlot: "MORNING",
    });

    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/Insufficient stock/i);
  });

  test("should restore stock after cancellation", async () => {
    // Place order
    const orderRes = await request(app).post("/api/orders").send({
      customerName: "Cancel Test",
      customerType: "CUSTOMER",
      productId: product.id,
      quantity: 1,
      deliverySlot: "MORNING",
    });

    expect(orderRes.status).toBe(201);

    const orderId = orderRes.body.order.orderId;

    const cancelRes = await request(app).patch(`/api/orders/cancel/${orderId}`);
    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.order.status).toBe("CANCELLED");
  });
});
