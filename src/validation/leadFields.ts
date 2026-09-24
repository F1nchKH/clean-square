import { leadFieldConstraints } from "../domain/types";

export type LeadFields = {
  name: string;
  phone: string;
  consent: boolean;
};

export type LeadFieldErrors = Partial<Record<keyof LeadFields, string>>;

export function validateLeadFields(fields: LeadFields): {
  data: LeadFields | null;
  errors: LeadFieldErrors;
} {
  const name = fields.name.trim();
  const phone = fields.phone.trim();
  const errors: LeadFieldErrors = {};

  if (
    name.length < leadFieldConstraints.name.minLength ||
    name.length > leadFieldConstraints.name.maxLength
  ) {
    errors.name = "Укажите имя от 2 до 80 символов.";
  }

  const digitCount = phone.replace(/\D/g, "").length;
  if (
    phone.length < leadFieldConstraints.phone.minLength ||
    phone.length > leadFieldConstraints.phone.maxLength ||
    !leadFieldConstraints.phone.allowedCharacters.test(phone) ||
    digitCount < leadFieldConstraints.phone.minDigits ||
    digitCount > leadFieldConstraints.phone.maxDigits
  ) {
    errors.phone = "Укажите телефон: от 7 до 15 цифр, без букв и посторонних знаков.";
  }

  if (fields.consent !== leadFieldConstraints.consent) {
    errors.consent = "Подтвердите согласие на обработку данных.";
  }

  return {
    data: Object.keys(errors).length === 0 ? { name, phone, consent: true } : null,
    errors,
  };
}
