import type { AddOnId, AddOnService, CleaningService, CleaningTypeId } from "../domain/types";

export const cleaningServices: Record<CleaningTypeId, CleaningService> = {
  maintenance: {
    id: "maintenance",
    title: "Поддерживающая уборка",
    description: "Регулярная уборка жилых помещений.",
    pricePerM2: 45,
    minPrice: 2500,
  },
  deep: {
    id: "deep",
    title: "Генеральная уборка",
    description: "Тщательная уборка всех основных зон.",
    pricePerM2: 90,
    minPrice: 4500,
  },
  "post-renovation": {
    id: "post-renovation",
    title: "Уборка после ремонта",
    description: "Удаление строительной пыли и следов ремонта.",
    pricePerM2: 120,
    minPrice: 6000,
  },
};

export const addOnServices: Record<AddOnId, AddOnService> = {
  windows: { id: "windows", title: "Мытьё окон", price: 1500 },
  fridge: { id: "fridge", title: "Мытьё холодильника внутри", price: 700 },
  oven: { id: "oven", title: "Мытьё духовки внутри", price: 700 },
};
