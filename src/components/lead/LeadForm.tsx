"use client";

import { useRef, useState, type FormEvent } from "react";
import { useCalculation } from "@/components/calculator/CalculationState";
import { validateLeadFields, type LeadFieldErrors } from "@/validation/leadFields";

type FormStatus = "idle" | "submitting" | "success" | "error" | "demo";

export function LeadForm({ demoMode }: { demoMode: boolean }) {
  const { calculation, areaError } = useCalculation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [showAreaError, setShowAreaError] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (demoMode) {
      setStatus("demo");
      return;
    }
    if (submitting.current || status === "success") return;

    const result = validateLeadFields({ name, phone, consent });
    setErrors(result.errors);
    setShowAreaError(calculation === null);
    if (!result.data || !calculation) return;

    submitting.current = true;
    setStatus("submitting");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          cleaningType: calculation.cleaningType,
          area: calculation.area,
          addOns: calculation.addOns,
        }),
      });
      const body: unknown = await response.json();
      if (
        response.status !== 201 ||
        typeof body !== "object" ||
        body === null ||
        !("success" in body) ||
        body.success !== true
      ) {
        throw new Error("Lead submission failed");
      }
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  if (status === "success") {
    return (
      <div className="lead-confirmation" role="status">
        <h3>Заявка отправлена</h3>
        <p>Спасибо! Мы свяжемся с вами, чтобы уточнить детали уборки.</p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      <div className="lead-field">
        <label htmlFor="lead-name">Ваше имя</label>
        <input
          id="lead-name"
          name="name"
          autoComplete={demoMode ? "off" : "name"}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
          }}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "lead-name-error" : undefined}
        />
        {errors.name && <p id="lead-name-error" className="field-error">{errors.name}</p>}
      </div>
      <div className="lead-field">
        <label htmlFor="lead-phone">Телефон</label>
        <input
          id="lead-phone"
          name="phone"
          type="tel"
          autoComplete={demoMode ? "off" : "tel"}
          inputMode="tel"
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
            if (errors.phone) setErrors((current) => ({ ...current, phone: undefined }));
          }}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "lead-phone-error" : undefined}
        />
        {errors.phone && <p id="lead-phone-error" className="field-error">{errors.phone}</p>}
      </div>
      <div className="consent-field">
        <label htmlFor="lead-consent">
          <input
            id="lead-consent"
            type="checkbox"
            checked={consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              if (errors.consent) setErrors((current) => ({ ...current, consent: undefined }));
            }}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "lead-consent-error" : undefined}
          />
          <span>
            {demoMode
              ? "Демо-согласие: данные не отправляются"
              : "Согласен на обработку персональных данных"}
          </span>
        </label>
        {errors.consent && <p id="lead-consent-error" className="field-error">{errors.consent}</p>}
      </div>
      {showAreaError && !calculation && (
        <p className="field-error" role="alert">
          {areaError} <a href="#calculator">Вернуться к калькулятору</a>
        </p>
      )}
      {status === "error" && (
        <p className="submission-error" role="alert">
          Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.
        </p>
      )}
      {status === "demo" && (
        <p className="lead-demo-note" role="status">
          Демо: заявка не отправлена. Данные не сохраняются.
        </p>
      )}
      <button className="button button-primary lead-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Отправляем…" : "Отправить заявку"}
      </button>
      <p className="lead-privacy-note">
        {demoMode
          ? "Данные не отправляются и не сохраняются. Не вводите реальные персональные данные."
          : "Демонстрационная форма. Текст согласия требует уточнения перед публичным запуском."}
      </p>
    </form>
  );
}
