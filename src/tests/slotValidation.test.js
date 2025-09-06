import { isValidDeliverySlot } from "../utils/helpers.js";

describe("Slot Validation", () => {
  test("valid slots pass", () => {
    expect(isValidDeliverySlot("MORNING")).toBe(true);
    expect(isValidDeliverySlot("Afternoon")).toBe(true);
    expect(isValidDeliverySlot("evening")).toBe(true);
  });

  test("invalid slot fails", () => {
    expect(isValidDeliverySlot("MIDNIGHT")).toBe(false);
  });
});
