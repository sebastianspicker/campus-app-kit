# Expo OTA Code Signing

If you use EAS Update, enable code signing and keep private keys out of this repo.
Store keys in a secret manager and reference them in CI.

## Recommended steps

1. Generate code signing keys locally.
2. Store private keys in a secret manager (GitHub Actions Secrets, 1Password, Vault).
3. Configure EAS Update to use signing.
4. Rotate keys if they ever leak.

This repo only documents the steps; it does not contain keys.
