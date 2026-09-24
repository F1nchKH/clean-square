import { describe, expect, it } from "vitest";
import { addOnServices, cleaningServices } from "../../src/config/pricing";
import { calculatePrice } from "../../src/domain/pricing";
import {
  addOnIds,
  areaConstraints,
  cleaningTypeIds,
  type CalculationInput,
} from "../../src/domain/types";

const validInput: CalculationInput = {
  cleaningType: "maintenance",
  area: areaConstraints.min,
  addOns: [],
};

// Exercise the runtime boundary with values TypeScript normally rejects.
function calculateUntrusted(input: unknown) {
  return calculatePrice(input as CalculationInput);
}

describe("calculatePrice", () => {
  it("uses the documented shared tariffs", () => {
    // These literals guard the product contract; calculation expectations below use the shared config.
    expect(cleaningServices.maintenance).toMatchObject({ pricePerM2: 45, minPrice: 2500 });
    expect(cleaningServices.deep).toMatchObject({ pricePerM2: 90, minPrice: 4500 });
    expect(cleaningServices["post-renovation"]).toMatchObject({ pricePerM2: 120, minPrice: 6000 });
    expect(addOnServices.windows.price).toBe(1500);
    expect(addOnServices.fridge.price).toBe(700);
    expect(addOnServices.oven.price).toBe(700);
  });

  it.each(cleaningTypeIds)("uses the minimum price for %s at the lower boundary", (cleaningType) => {
    const input = { ...validInput, cleaningType };

    expect(calculatePrice(input)).toEqual({
      ...input,
      totalPrice: cleaningServices[cleaningType].minPrice,
    });
  });

  it.each(cleaningTypeIds)("uses the per-square-metre price for %s at the upper boundary", (cleaningType) => {
    const input = { ...validInput, cleaningType, area: areaConstraints.max };

    expect(calculatePrice(input).totalPrice).toBe(
      cleaningServices[cleaningType].pricePerM2 * areaConstraints.max,
    );
  });

  it("does not add a surcharge when no add-ons are selected", () => {
    const input = { ...validInput, cleaningType: "deep" as const, area: 100 };

    expect(calculatePrice(input).totalPrice).toBe(cleaningServices.deep.pricePerM2 * input.area);
  });

  it.each(addOnIds)("adds the price of %s once", (addOn) => {
    expect(calculatePrice({ ...validInput, addOns: [addOn] }).totalPrice).toBe(
      cleaningServices.maintenance.minPrice + addOnServices[addOn].price,
    );
  });

  it("adds several distinct add-ons to the base price", () => {
    expect(calculatePrice({ ...validInput, addOns: [...addOnIds] }).totalPrice).toBe(
      cleaningServices.maintenance.minPrice +
        addOnIds.reduce((sum, id) => sum + addOnServices[id].price, 0),
    );
  });

  it.each([null, areaConstraints.min - 1, areaConstraints.max + 1, 10.5, NaN, Infinity])(
    "rejects invalid area %s",
    (area) => {
      expect(() => calculatePrice({ ...validInput, area })).toThrow(RangeError);
    },
  );

  it.each(["unknown", ["deep"], new String("deep"), null, undefined])(
    "rejects invalid cleaning type %s",
    (cleaningType) => {
      expect(() => calculateUntrusted({ ...validInput, cleaningType })).toThrow(RangeError);
    },
  );

  it.each(["unknown", ["oven"], new String("oven"), null, undefined])(
    "rejects invalid add-on %s",
    (addOn) => {
      expect(() => calculateUntrusted({ ...validInput, addOns: [addOn] })).toThrow(RangeError);
    },
  );

  it("rejects duplicate add-ons and a non-array add-on value", () => {
    expect(() => calculatePrice({ ...validInput, addOns: ["oven", "oven"] })).toThrow(RangeError);
    expect(() => calculateUntrusted({ ...validInput, addOns: "oven" })).toThrow(RangeError);
  });

  it("rejects a missing input and an area passed as a string", () => {
    expect(() => calculateUntrusted(null)).toThrow(RangeError);
    expect(() => calculateUntrusted({ ...validInput, area: "10" })).toThrow(RangeError);
  });

  it("is deterministic and does not retain or mutate the input add-ons", () => {
    const input: CalculationInput = { ...validInput, addOns: ["windows"] };
    const first = calculatePrice(input);
    const second = calculatePrice(input);

    expect(second).toEqual(first);
    expect(input.addOns).toEqual(["windows"]);
    expect(first.addOns).not.toBe(input.addOns);
    input.addOns.pop();
    expect(first.addOns).toEqual(["windows"]);
  });
});
