import type { AddOnId, AddOnService, CleaningService, CleaningTypeId } from "../domain/types";

export const cleaningServices: Record<CleaningTypeId, CleaningService> = {
  maintenance: {
    id: "maintenance",
    title: "Поддерживающая уборка",
    description: "Для регулярного порядка без сильных загрязнений.",
    pricePerM2: 45,
    minPrice: 2500,
  },
  deep: {
    id: "deep",
    title: "Генеральная уборка",
    description: "Когда кухне, санузлу и поверхностям нужно больше внимания.",
    pricePerM2: 90,
    minPrice: 4500,
  },
  "post-renovation": {
    id: "post-renovation",
    title: "Уборка после ремонта",
    description: "Когда после отделки остаются пыль и следы работ.",
    pricePerM2: 120,
    minPrice: 6000,
  },
};

export const addOnServices: Record<AddOnId, AddOnService> = {
  windows: { id: "windows", title: "Мытьё окон", price: 1500 },
  fridge: { id: "fridge", title: "Мытьё холодильника внутри", price: 700 },
  oven: { id: "oven", title: "Мытьё духовки внутри", price: 700 },
};
