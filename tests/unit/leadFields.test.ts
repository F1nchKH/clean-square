import { describe, expect, it } from "vitest";
import { validateLeadFields } from "../../src/validation/leadFields";

describe("lead field validation", () => {
  const valid = { name: "  Анна Иванова  ", phone: "  +7 (999) 123-45-67  ", consent: true };

  it("trims valid values without changing the entered phone format", () => {
    expect(validateLeadFields(valid)).toEqual({
      data: { name: "Анна Иванова", phone: "+7 (999) 123-45-67", consent: true },
      errors: {},
    });
  });

  it.each([" ", "А", "А".repeat(81)])("rejects invalid name %s", (name) => {
    expect(validateLeadFields({ ...valid, name }).errors.name).toBeTruthy();
  });

  it.each(["123456", "1".repeat(16), "1234567a", "-".repeat(33)])(
    "rejects invalid phone %s",
    (phone) => {
      expect(validateLeadFields({ ...valid, phone }).errors.phone).toBeTruthy();
    },
  );

  it("requires explicit consent", () => {
    expect(validateLeadFields({ ...valid, consent: false }).errors.consent).toBeTruthy();
  });
});
