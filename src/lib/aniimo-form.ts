import type { Aniimo } from "@/types/content";

export function applyAniimoForm(base: Aniimo, formId: string): Aniimo {
  const form = base.formRecords.find((record) => record.id === formId);
  if (!form) return base;
  return {
    ...base,
    ...form,
    voteImage: form.id === base.id ? base.voteImage : undefined,
    forms: base.forms.map((item) => ({ ...item, isCurrent: item.id === formId })),
    formRecords: base.formRecords,
  };
}
