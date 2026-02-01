import { InstitutionPackSchema, type InstitutionPack } from "@campus/shared";
import { examplePublicPack } from "./packs/example.public";
import { hfmtPublicPack } from "./packs/hfmt.public";

const packs = {
  example: examplePublicPack,
  hfmt: hfmtPublicPack
} as const;

export type KnownInstitutionId = keyof typeof packs;

export function getInstitutionPack(institutionId: string): InstitutionPack {
  const candidate = (packs as Record<string, unknown>)[institutionId];
  if (!candidate) {
    throw new Error(`Unknown institutionId: ${institutionId}`);
  }
  return InstitutionPackSchema.parse(candidate);
}
