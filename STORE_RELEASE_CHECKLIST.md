# 18 Sitters Store Release Checklist

This project is now set up as a Capacitor native app.

## Current Native IDs

- App name: `18 Sitters`
- iOS bundle identifier: `com.eighteensitters.app`
- Android application ID: `com.eighteensitters.app`
- Initial version: `1.0`
- Android version code: `1`

## Built Locally

- Web app: `dist/`
- Android project: `android/`
- iOS project: `ios/`

## What Is Still Needed Before Public Store Submission

### Accounts

- Apple Developer Program membership.
- Google Play Console developer account.

### Legal URLs

- Public privacy policy URL.
- Terms of service URL.
- Support URL or support email.
- Contact email for app review.

### Product Decisions

- Decide whether this first release is a prototype/demo or a real marketplace.
- If real marketplace: add backend auth, database, messaging, moderation, reporting/blocking, account deletion, and support workflows.
- If subscriptions are real: configure Apple In-App Purchase subscriptions and Google Play Billing subscriptions. Do not use external payment for digital subscriptions sold inside the app.

### Apple App Store Connect

- Create app record.
- Bundle ID: `com.eighteensitters.app`.
- Upload archive from Xcode on macOS.
- Complete App Privacy labels.
- Add screenshots, description, keywords, category, age rating, support URL, marketing URL if available.
- Submit to TestFlight first.

### Google Play Console

- Create app record.
- Package name: `com.eighteensitters.app`.
- Upload signed `.aab` from Android Studio or Gradle.
- Complete Data Safety form.
- Complete Content Rating questionnaire.
- Add screenshots, short description, full description, app icon, feature graphic, category, contact details, privacy policy URL.
- Submit to Internal Testing first.

## Local Build Commands

```bash
npm run check
npm run build
npm run cap:sync
```

## Android Release Build

Requires Android Studio or a JDK plus Android SDK on PATH.

```bash
cd android
gradlew.bat bundleRelease
```

The store artifact will be an `.aab` file under `android/app/build/outputs/bundle/release/` after signing is configured.

Cloud builds can use `.github/workflows/native-build.yml` or `codemagic.yaml`. See `CLOUD_BUILD_SETUP.md`.

## iOS Release Build

Requires macOS with Xcode.

```bash
npm run cap:sync
npx cap open ios
```

In Xcode:

1. Select the `App` target.
2. Set the team/signing certificate.
3. Confirm bundle ID `com.eighteensitters.app`.
4. Product > Archive.
5. Distribute App > App Store Connect.

## Review Risk Notes

- The current app is a high-fidelity prototype with static/demo data.
- App Store and Play review can reject apps that appear unfinished, misleading, or lack real user value.
- For a real babysitting marketplace, moderation, safety, privacy, account deletion, and support flows matter before public launch.
