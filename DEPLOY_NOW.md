# NiñoPulse Global 5.0.1 — deploy now

This repository is prepared for GitHub + Vercel first, then Android/Google Play.

## 1. GitHub

Create a repository and upload the contents of this folder at its root. Do **not** upload:

- `.env` / `.env.android`
- `android/keystore.properties`
- `*.jks`
- `node_modules/`
- `dist/`

The included `.gitignore` already protects these files.

## 2. Vercel

Import the GitHub repository into Vercel.

Recommended settings:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 20+

No NOAA credential is required. For the web deployment, the app automatically uses the same HTTPS origin for `/api/*` when `VITE_API_BASE_URL` is not set.

After deployment, verify these URLs in the browser:

- `/api/health`
- `/api/enso`
- `/api/v1/enso`
- `/api/v1/history`
- `/api/v1/live-countries`

The `/api/enso` response should contain a recent `generatedAt` and the current NOAA values. If NOAA is temporarily unavailable, the API may return the last valid server snapshot as stale data.

## 3. Android API configuration

After the Vercel deployment is confirmed, create `.env.android` locally:

```env
VITE_API_BASE_URL=https://YOUR-VERCEL-DOMAIN.vercel.app
```

Then run:

```bash
npm ci
npm run android:aab
```

The command now automatically runs, in order:

1. `android:config`
2. `build`
3. `android:sync`
4. signed Gradle AAB build

The Android Gradle preflight refuses to build if the generated API URL is missing or is not HTTPS.

## 4. Signing

Before `npm run android:aab`, create `android/keystore.properties` from the example and configure your existing upload key. Keep the keystore and passwords outside Git.

The current release is:

- applicationId: `com.vekkai.ninopulse`
- versionCode: `10`
- versionName: `5.0.1`
- compileSdk: `36`
- targetSdk: `36`

AAB output:

`android/app/build/outputs/bundle/release/app-release.aab`

## 5. Google Play

Upload the AAB to the closed-testing track first. Test the actual Play-distributed build on a physical Android device. Only promote/request production after verifying that the app is receiving the current Vercel/NOAA data and that no stale July 2026 fallback appears.
