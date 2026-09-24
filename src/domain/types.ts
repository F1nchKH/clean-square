export const cleaningTypeIds = ["maintenance", "deep", "post-renovation"] as const;
export type CleaningTypeId = (typeof cleaningTypeIds)[number];

export const addOnIds = ["windows", "fridge", "oven"] as const;
export type AddOnId = (typeof addOnIds)[number];

export const areaConstraints = { min: 10, max: 500 } as const;

export const leadFieldConstraints = {
  name: { minLength: 2, maxLength: 80 },
  phone: {
    minLength: 7,
    maxLength: 32,
    minDigits: 7,
    maxDigits: 15,
    allowedCharacters: /^[0-9 +()-]+$/,
  },
  consent: true,
} as const;

export type CleaningService = {
  id: CleaningTypeId;
  title: string;
  description: string;
  pricePerM2: number;
  minPrice: number;
};

export type AddOnService = {
  id: AddOnId;
  title: string;
  price: number;
};

export type CalculationInput = {
  cleaningType: CleaningTypeId;
  area: number | null;
  addOns: AddOnId[];
};

export type Calculation = {
  cleaningType: CleaningTypeId;
  area: number;
  addOns: AddOnId[];
  totalPrice: number;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  cleaningType: CleaningTypeId;
  area: number;
  addOns: AddOnId[];
  calculatedPrice: number;
  consent: boolean;
  createdAt: string;
};
