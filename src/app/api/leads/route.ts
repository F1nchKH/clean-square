import { calculatePrice } from "../../../domain/pricing";
import type { LeadDraft } from "../../../domain/types";
import { submitLead } from "../../../server/leads";
import { leadSchema } from "../../../validation/lead";
import { siteMode } from "../../../config/site";

type LeadApiResponse =
  | { success: true }
  | { success: false; code: "VALIDATION_ERROR" | "SUBMISSION_ERROR" };

function apiResponse(body: LeadApiResponse, status: 201 | 400 | 500): Response {
  return Response.json(body, { status });
}

export function createLeadPostHandler(saveLead: (lead: LeadDraft) => Promise<void>, portfolioDemo = false) {
  return async (request: Request): Promise<Response> => {
    if (portfolioDemo) {
      return apiResponse({ success: false, code: "SUBMISSION_ERROR" }, 500);
    }
    let input: unknown;
    try {
      input = await request.json();
    } catch {
      return apiResponse({ success: false, code: "VALIDATION_ERROR" }, 400);
    }

    const parsed = leadSchema.safeParse(input);
    if (!parsed.success) {
      return apiResponse({ success: false, code: "VALIDATION_ERROR" }, 400);
    }

    try {
      const calculation = calculatePrice(parsed.data);
      await saveLead({ ...parsed.data, calculatedPrice: calculation.totalPrice });
      return apiResponse({ success: true }, 201);
    } catch {
      return apiResponse({ success: false, code: "SUBMISSION_ERROR" }, 500);
    }
  };
}

export const POST = createLeadPostHandler(submitLead, siteMode === "portfolio");
