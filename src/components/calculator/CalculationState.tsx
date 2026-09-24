"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { calculatePrice } from "@/domain/pricing";
import {
  areaConstraints,
  type AddOnId,
  type Calculation,
  type CleaningTypeId,
} from "@/domain/types";

type CalculationState = {
  cleaningType: CleaningTypeId;
  setCleaningType: (value: CleaningTypeId) => void;
  areaText: string;
  setAreaText: (value: string) => void;
  addOns: AddOnId[];
  toggleAddOn: (value: AddOnId) => void;
  calculation: Calculation | null;
  areaError: string | null;
};

const Context = createContext<CalculationState | null>(null);

export function CalculationProvider({ children }: { children: ReactNode }) {
  const [cleaningType, setCleaningType] = useState<CleaningTypeId>("maintenance");
  const [areaText, setAreaText] = useState("50");
  const [addOns, setAddOns] = useState<AddOnId[]>([]);

  const area = /^\d+$/.test(areaText) ? Number(areaText) : null;
  const areaError =
    area === null || area < areaConstraints.min || area > areaConstraints.max
      ? `Укажите площадь целым числом от ${areaConstraints.min} до ${areaConstraints.max} м².`
      : null;
  const calculation =
    areaError === null
      ? calculatePrice({ cleaningType, area, addOns })
      : null;

  function toggleAddOn(value: AddOnId) {
    setAddOns((current) =>
      current.includes(value)
        ? current.filter((id) => id !== value)
        : [...current, value],
    );
  }

  return (
    <Context.Provider
      value={{
        cleaningType,
        setCleaningType,
        areaText,
        setAreaText,
        addOns,
        toggleAddOn,
        calculation,
        areaError,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useCalculation() {
  const state = useContext(Context);
  if (!state) throw new Error("CalculationProvider is missing");
  return state;
}
