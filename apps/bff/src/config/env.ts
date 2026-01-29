/** Placeholder: Produktionsfähige BFF-Konfiguration / Env-Validation */

export type BffEnv = {
  port: number;
  institutionId: string;
  corsOrigins: string[];
};

export function getBffEnv(): BffEnv {
  // TODO:
  // - Port, Institution, evtl. CORS-Origins aus process.env lesen.
  // - Validieren (z. B. `inArray`, `Number`?) und klare Fehler werfen.
  // - Sensible Defaults vermeiden (keine hardgecodeten „hfmt“-Fallbacks).
  throw new Error("TODO: getBffEnv implementieren");
}
