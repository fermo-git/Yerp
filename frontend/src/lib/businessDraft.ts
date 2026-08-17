import type { BusinessCategory } from "@/types/business";

export const BUSINESS_DRAFT_KEY = "la-frontera:business-draft";

export interface BusinessDraft {
  name: string;
  category?: BusinessCategory;
  description?: string;
}

export function readBusinessDraft(): BusinessDraft | null {
  try {
    const raw = sessionStorage.getItem(BUSINESS_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BusinessDraft>;
    if (typeof parsed.name !== "string") return null;
    return {
      name: parsed.name,
      category: parsed.category,
      description: parsed.description,
    };
  } catch {
    return null;
  }
}

export function saveBusinessDraft(draft: BusinessDraft): void {
  try {
    sessionStorage.setItem(BUSINESS_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // sessionStorage no disponible (modo privado): el prellenado es opcional.
  }
}

export function clearBusinessDraft(): void {
  try {
    sessionStorage.removeItem(BUSINESS_DRAFT_KEY);
  } catch {
    // ignorar
  }
}