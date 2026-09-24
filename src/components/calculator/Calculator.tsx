"use client";

import { addOnServices, cleaningServices } from "@/config/pricing";
import { addOnIds, areaConstraints, cleaningTypeIds } from "@/domain/types";
import { CalculationSummary } from "./CalculationSummary";
import { useCalculation } from "./CalculationState";

const rubles = new Intl.NumberFormat("ru-RU");

export function Calculator() {
  const state = useCalculation();

  return (
    <div className="calculator-shell">
      <div className="shell-topline">
        <span>Ваш расчёт</span>
        <span>01 / 02</span>
      </div>
      <fieldset className="calculator-fieldset">
        <legend>Вид уборки</legend>
        <div className="choice-list">
          {cleaningTypeIds.map((id) => (
            <label className="choice" key={id}>
              <input
                type="radio"
                name="cleaningType"
                value={id}
                checked={state.cleaningType === id}
                onChange={() => state.setCleaningType(id)}
              />
              <span>{cleaningServices[id].title}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="area-field">
        <label htmlFor="area">Площадь, м²</label>
        <input
          id="area"
          type="number"
          inputMode="numeric"
          min={areaConstraints.min}
          max={areaConstraints.max}
          step="1"
          value={state.areaText}
          onChange={(event) => state.setAreaText(event.target.value)}
          aria-invalid={state.areaError !== null}
          aria-describedby={state.areaError ? "area-error" : "area-hint"}
        />
        {state.areaError ? (
          <p className="field-error" id="area-error" role="alert">
            {state.areaError}
          </p>
        ) : (
          <p className="field-hint" id="area-hint">
            От {areaConstraints.min} до {areaConstraints.max} м²
          </p>
        )}
      </div>

      <fieldset className="calculator-fieldset">
        <legend>Дополнительные услуги</legend>
        <div className="choice-list">
          {addOnIds.map((id) => (
            <label className="choice" key={id}>
              <input
                type="checkbox"
                checked={state.addOns.includes(id)}
                onChange={() => state.toggleAddOn(id)}
              />
              <span>{addOnServices[id].title}</span>
              <span className="choice-price">+{rubles.format(addOnServices[id].price)} ₽</span>
            </label>
          ))}
        </div>
      </fieldset>

      {state.calculation ? (
        <>
          <CalculationSummary calculation={state.calculation} />
          <a className="button button-primary calculator-cta" href="#lead">
            Перейти к заявке <span aria-hidden="true">↗</span>
          </a>
        </>
      ) : (
        <p className="calculation-prompt">
          Введите допустимую площадь, чтобы увидеть расчёт и перейти к заявке.
        </p>
      )}
    </div>
  );
}
