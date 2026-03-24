import type { InstitutionPack } from "@campus/shared";
import { getInstitutionPack } from "@campus/institutions";

export type { InstitutionPack };

let cachedPack: InstitutionPack | null = null;

export async function loadInstitutionPack(
  institutionId: string
): Promise<InstitutionPack> {
  if (cachedPack && cachedPack.id === institutionId) {
    return cachedPack;
  }
  cachedPack = await getInstitutionPack(institutionId);
  return cachedPack;
}
