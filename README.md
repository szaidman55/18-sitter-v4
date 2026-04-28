# 18 Sitters v4

Deployable static app prototype for 18 Sitters, rebuilt from the v4 HTML prototype and the designer brief.

## What is included

- Production-ready `index.html` with metadata, app manifest, mobile viewport handling, and a hidden prototype navigation toggle.
- Brand assets under `public/brand`.
- Supabase Auth/Postgres setup under `supabase/migrations` and `SUPABASE_SETUP.md`.
- Designer brief copy in `BRIEF.md`.
- No-dependency build, check, and local preview scripts.
- Netlify and Vercel static deployment config.

## Commands

```bash
npm run check
npm run build
npm start
npm run cap:sync
```

`npm run build` writes the deployable site to `dist/`.

## Backend

The app is wired for Supabase Auth + Postgres. Run the SQL migration in `supabase/migrations/` inside your Supabase project, then set `SUPABASE_URL` and `SUPABASE_ANON_KEY` before building.

## Deployment

This project is intentionally static. Deploy the `dist` folder on Netlify, Vercel, GitHub Pages, or any static host.

Recommended build settings:

- Build command: `npm run build`
- Publish directory: `dist`

GitHub Pages fallback:

- Source branch: `main`
- Source folder: `/docs`
- Expected URL: `https://szaidman55.github.io/18-sitter-v4/`

## Native App Store Builds

This project uses Capacitor to generate native iOS and Android shells from the static web app.

```bash
npm run cap:sync
```

Native project folders:

- `ios/` for Xcode, TestFlight, and App Store Connect.
- `android/` for Android Studio and Google Play Console.

Store bundle IDs:

- iOS bundle identifier: `com.eighteensitters.app`
- Android application ID: `com.eighteensitters.app`

iOS App Store submission requires macOS with Xcode and an active Apple Developer Program account. Android Play Store submission requires Android Studio/JDK signing setup and a Google Play Console developer account.

## Brand Direction

The visual system follows the supplied brief: refined navy, warm gold, ivory, calm editorial typography, premium family-concierge feel, and subtle Jewish community identity without obvious religious iconography in the core UI.
