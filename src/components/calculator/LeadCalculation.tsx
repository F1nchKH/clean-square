"use client";

import { CalculationSummary } from "./CalculationSummary";
import { useCalculation } from "./CalculationState";

export function LeadCalculation() {
  const { calculation } = useCalculation();

  return (
    <div className="lead-shell">
      <span className="shell-topline">Ваша заявка</span>
      <p className="shell-title">Ваш расчёт</p>
      {calculation ? (
        <CalculationSummary calculation={calculation} />
      ) : (
        <p>Укажите допустимую площадь в калькуляторе, чтобы перейти к заявке.</p>
      )}
      <p className="lead-next-stage">Форма заявки появится на следующем этапе.</p>
    </div>
  );
}
