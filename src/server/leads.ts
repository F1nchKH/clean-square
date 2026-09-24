import type { LeadDraft } from "../domain/types";
import { createServerSupabaseClient } from "./supabase";

export async function submitLead(lead: LeadDraft): Promise<void> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("leads").insert({
    name: lead.name,
    phone: lead.phone,
    cleaning_type: lead.cleaningType,
    area: lead.area,
    add_ons: lead.addOns,
    calculated_price: lead.calculatedPrice,
    consent: lead.consent,
  });

  if (error) throw new Error("Lead insert failed");
}
