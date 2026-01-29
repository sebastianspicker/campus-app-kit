// Placeholder: Production-ready Expo config
// TODO:
// - Set ios.bundleIdentifier / android.package
// - Configure icons/splash, version/build numbers
// - Inject BFF base URL via `extra` for release builds
// - Add schemes / deep links if needed

import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    // TODO: move values from app.json or override here
    extra: {
      // TODO: BFF_BASE_URL for production builds
    }
  };
};
