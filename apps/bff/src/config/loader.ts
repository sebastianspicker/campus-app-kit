import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { InstitutionPackSchema } from "@campus/shared";

export type InstitutionPack = ReturnType<typeof InstitutionPackSchema.parse>;

export async function loadInstitutionPack(
  institutionId: string
): Promise<InstitutionPack> {
  const filePath = resolve(
    process.cwd(),
    "src",
    "config",
    "institutions",
    `${institutionId}.public.json`
  );

  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  return InstitutionPackSchema.parse(parsed);
}
