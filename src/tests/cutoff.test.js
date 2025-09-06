import { calculateDeliveryDate } from "../utils/helpers.js";

describe("Cut-off logic", () => {
  test("before cutoff (5 PM) → +1 day", () => {
    const date = new Date("2025-09-06T17:00:00");
    const deliveryDate = calculateDeliveryDate(date);
    expect(deliveryDate).toBe("2025-09-07");
  });

  test("after cutoff (7 PM) → +2 days", () => {
    const date = new Date("2025-09-06T19:00:00");
    const deliveryDate = calculateDeliveryDate(date);
    expect(deliveryDate).toBe("2025-09-08");
  });
});
