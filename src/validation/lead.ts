import { z } from "zod";
import {
  addOnIds,
  areaConstraints,
  cleaningTypeIds,
  leadFieldConstraints,
} from "../domain/types";

export const leadSchema = z.object({
  name: z.string().trim()
    .min(leadFieldConstraints.name.minLength)
    .max(leadFieldConstraints.name.maxLength),
  phone: z.string().trim()
    .min(leadFieldConstraints.phone.minLength)
    .max(leadFieldConstraints.phone.maxLength)
    .regex(leadFieldConstraints.phone.allowedCharacters)
    .refine((phone) => {
      const digits = phone.replace(/\D/g, "").length;
      return digits >= leadFieldConstraints.phone.minDigits &&
        digits <= leadFieldConstraints.phone.maxDigits;
    }),
  cleaningType: z.enum(cleaningTypeIds),
  area: z.number().int().min(areaConstraints.min).max(areaConstraints.max),
  addOns: z.array(z.enum(addOnIds))
    .refine((addOns) => new Set(addOns).size === addOns.length),
  consent: z.literal(true),
});
