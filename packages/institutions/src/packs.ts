// Placeholder: institution packs packaged for runtime usage (mobile + API routes)
// TODO:
// - Move `apps/bff/src/config/institutions/*.public.json` into this package
// - Export them as typed values
// - Keep this package free of secrets/private endpoints

import type { InstitutionPack } from "@campus/shared";

export function getInstitutionPack(institutionId: string): InstitutionPack {
  // TODO: implement real lookup; example stub only
  if (institutionId === "hfmt") {
    return {
      id: "hfmt",
      name: "University for Music and Dance (HfMT Cologne)",
      type: "music-and-dance",
      campuses: [],
      publicSources: {
        events: [],
        schedules: []
      }
    };
  }

  throw new Error(`Unknown institutionId: ${institutionId}`);
}

