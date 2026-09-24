import { addOnServices, cleaningServices } from "@/config/pricing";
import type { Calculation } from "@/domain/types";

const rubles = new Intl.NumberFormat("ru-RU");

export function CalculationSummary({ calculation }: { calculation: Calculation }) {
  return (
    <div className="calculation-summary">
      <p className="summary-label">Предварительная стоимость</p>
      <strong className="summary-price" data-testid="estimated-price">
        {rubles.format(calculation.totalPrice)} ₽
      </strong>
      <dl className="summary-details">
        <div>
          <dt>Уборка</dt>
          <dd>{cleaningServices[calculation.cleaningType].title}</dd>
        </div>
        <div>
          <dt>Площадь</dt>
          <dd>{calculation.area} м²</dd>
        </div>
        <div>
          <dt>Дополнительно</dt>
          <dd>
            {calculation.addOns.length
              ? calculation.addOns.map((id) => addOnServices[id].title).join(", ")
              : "Без дополнительных услуг"}
          </dd>
        </div>
      </dl>
      <p className="summary-note">Итоговую цену уточним перед уборкой.</p>
    </div>
  );
}
