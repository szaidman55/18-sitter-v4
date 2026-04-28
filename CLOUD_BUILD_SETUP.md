# Cloud Build Setup

You do not need to own a Mac if you use cloud macOS builds. This project now includes:

- GitHub Actions workflow: `.github/workflows/native-build.yml`
- Codemagic workflow: `codemagic.yaml`

## Recommended Path

Use Codemagic for the first iOS TestFlight build because it has a direct App Store Connect integration and can manage iOS signing profiles without a local Mac.

## Step 1: Put This Project On GitHub

Create a repository named `18-sitter-v4`, then upload this project.

GitHub was not available from this machine because `git`/`gh` are not installed and the connected GitHub app has no installed account permissions.

## Step 2: Create Developer Accounts

- Apple Developer Program account.
- Google Play Console developer account.

## Step 3: Codemagic iOS Setup

1. Sign in to Codemagic.
2. Connect the GitHub repository.
3. Add the app.
4. Connect App Store Connect API.
5. Ensure the Bundle ID is `com.eighteensitters.app`.
6. Create an app record in App Store Connect for `18 Sitters`.
7. Run workflow `ios-testflight`.

The workflow will:

- Install dependencies.
- Build the web app.
- Sync Capacitor.
- Fetch/create signing files.
- Build an `.ipa`.
- Submit to TestFlight.

## Step 4: Android Setup

For Android release builds, add these secrets to Codemagic or GitHub Actions:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

The release workflow will produce a signed `.aab` for Google Play Console.

## Step 5: Store Submission

Before public submission, replace the drafts:

- `PRIVACY_POLICY_DRAFT.md`
- `APP_STORE_LISTING_DRAFT.md`

You also need public URLs for:

- Privacy policy.
- Support.
- Terms of service.

## Important Reality Check

This is currently a static high-fidelity app prototype. App review may reject it if it looks like a demo instead of a complete product. For a real marketplace release, add:

- User accounts.
- Backend database.
- Messaging backend.
- Reporting/blocking.
- Account deletion.
- Subscription implementation through Apple/Google billing.
- Privacy policy matching real data collection.
