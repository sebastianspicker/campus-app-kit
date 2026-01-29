// Placeholder: institution pack loading for Expo API routes
// TODO:
// - Decide where packs live for EAS Hosting:
//   a) Bundle them via `@campus/institutions` (recommended)
//   b) Fetch remote JSON from a public URL (CDN/GitHub raw)
// - Add validation via `InstitutionPackSchema`
// - Support `INSTITUTION_ID` selection (env / query param)

import { InstitutionPackSchema } from "@campus/shared";
import { getInstitutionPack } from "@campus/institutions";

export type ApiInstitutionPack = ReturnType<typeof InstitutionPackSchema.parse>;

export async function loadInstitutionPackForApi(
  institutionId: string
): Promise<ApiInstitutionPack> {
  // TODO: make this async if packs are remote-fetched
  const pack = getInstitutionPack(institutionId);
  return InstitutionPackSchema.parse(pack);
}

