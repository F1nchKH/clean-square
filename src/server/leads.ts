import type { LeadDraft } from "../domain/types";

export const submitLead: (lead: LeadDraft) => Promise<void> = async () => {
  // Stage 7 connects persistence. Until then, never confirm an unstored lead.
  throw new Error("Lead persistence is not configured");
}
