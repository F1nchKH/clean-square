import type { AddOnId, AddOnService, CleaningService, CleaningTypeId } from "../domain/types";

export const cleaningServices: Record<CleaningTypeId, CleaningService> = {
  maintenance: {
    id: "maintenance",
    title: "Поддерживающая уборка",
    description: "Для привычного порядка без накопившихся загрязнений.",
    detail: "Открытые поверхности, пол, кухня и санузел.",
    pricePerM2: 45,
    minPrice: 2500,
  },
  deep: {
    id: "deep",
    title: "Генеральная уборка",
    description: "Когда обычной уборки уже недостаточно.",
    detail: "Больше внимания кухне, санузлу, дверям и плинтусам.",
    pricePerM2: 90,
    minPrice: 4500,
  },
  "post-renovation": {
    id: "post-renovation",
    title: "Уборка после ремонта",
    description: "Чтобы убрать пыль и следы отделочных работ.",
    detail: "Доступные поверхности, пол и оставшиеся следы ремонта.",
    pricePerM2: 120,
    minPrice: 6000,
  },
};

export const addOnServices: Record<AddOnId, AddOnService> = {
  windows: { id: "windows", title: "Мытьё окон", price: 1500 },
  fridge: { id: "fridge", title: "Мытьё холодильника внутри", price: 700 },
  oven: { id: "oven", title: "Мытьё духовки внутри", price: 700 },
};
