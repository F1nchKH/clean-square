"use client";

import { useCalculation } from "./CalculationState";

export function FinalCTA() {
  const { calculation } = useCalculation();

  return (
    <a className="button button-light" href={calculation ? "#lead" : "#calculator"}>
      {calculation ? "Перейти к заявке" : "Вернуться к расчёту"}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}
