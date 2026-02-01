import { InstitutionPackSchema } from "@campus/shared";
import { getInstitutionPack } from "@campus/institutions";

export type InstitutionPack = ReturnType<typeof InstitutionPackSchema.parse>;

export async function loadInstitutionPack(
  institutionId: string
): Promise<InstitutionPack> {
  const pack = getInstitutionPack(institutionId);
  return InstitutionPackSchema.parse(pack);
}
