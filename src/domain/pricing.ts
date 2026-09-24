import { addOnServices, cleaningServices } from "../config/pricing";
import { areaConstraints, type Calculation, type CalculationInput } from "./types";

export function calculatePrice(input: CalculationInput): Calculation {
  if (
    !input ||
    typeof input.cleaningType !== "string" ||
    !Object.hasOwn(cleaningServices, input.cleaningType)
  ) {
    throw new RangeError("Invalid cleaning type");
  }

  if (
    !Number.isInteger(input.area) ||
    input.area === null ||
    input.area < areaConstraints.min ||
    input.area > areaConstraints.max
  ) {
    throw new RangeError("Area must be an integer from 10 to 500 m²");
  }

  if (
    !Array.isArray(input.addOns) ||
    input.addOns.some(
      (id) => typeof id !== "string" || !Object.hasOwn(addOnServices, id),
    ) ||
    new Set(input.addOns).size !== input.addOns.length
  ) {
    throw new RangeError("Invalid add-ons");
  }

  const service = cleaningServices[input.cleaningType];
  const basePrice = Math.max(service.minPrice, service.pricePerM2 * input.area);
  const totalPrice = input.addOns.reduce(
    (sum, id) => sum + addOnServices[id].price,
    basePrice,
  );

  return {
    cleaningType: input.cleaningType,
    area: input.area,
    addOns: [...input.addOns],
    totalPrice,
  };
}
