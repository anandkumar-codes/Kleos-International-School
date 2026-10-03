# Kleos School — mobile app

The official Kleos International School app for Android and iOS, built with Expo (React Native, SDK 57)
and Expo Router. One app, four experiences:

| Role | Tabs | Highlights |
|------|------|-----------|
| **Visitor** (no login) | Home · Admissions · Gallery · Contact | School story, programmes, facilities, events, validated enquiry form, swipeable photo viewer, call / WhatsApp / directions |
| **Parent** | Home · Attendance · Academics · Fees · More | Child dashboard, attendance calendar, homework & results, online fee payment with receipts, leave requests, chat with the class teacher |
| **Student** | Home · Timetable · Tasks · Results · More | Today's classes, assignments, results, subjects, attendance |
| **Staff** | Dashboard · Admissions · Students · Attendance · More | Live KPIs and charts, admissions pipeline, 1,248-student directory, mark attendance, fee collection, post announcements, inbox, notifications |

## Run it on your phone (no Android Studio needed)

1. Install **Expo Go** from the Play Store / App Store.
2. On the computer, in this `mobile` folder, run:
   ```powershell
   npm.cmd install      # first time only
   npm.cmd start        # or double-click start.cmd
   ```
3. Scan the QR code shown in the terminal (Android: from inside Expo Go; iPhone: with the Camera app).
   The phone and computer must be on the same Wi-Fi. If they can't be, run `npx.cmd expo start --tunnel`.

To preview in a browser instead: `npm.cmd run web` (opens http://localhost:8081).

## Demo logins

| Role    | Username       | Password   |
|---------|----------------|------------|
| Parent  | `parent@kleos` | `kleos123` |
| Student | `KIS-sahithi`  | `kleos123` |
| Staff   | `admin@kleos`  | `admin123` |

The login screen has a **Use demo account** button that fills these in.

## Build an installable APK

A ready-built APK is at `../Kleos-School-v1.0.0.apk` (Android 7.0+, 64-bit ARM phones).

**Rebuild locally:** double-click `build-apk.cmd`. It uses the JDK 17 + Android SDK installed in
`C:\Users\APPLE\Android`, builds from the short path `C:\kb` (Windows path-length limits break the
React Native C++ build in long folders), and copies the new APK back to the School folder.

**Or build in the cloud** with EAS:

APKs are built in the cloud with EAS, so no local Android SDK is required. You need a free Expo account.

```powershell
npx.cmd eas-cli@latest login
npm.cmd run build:apk        # = eas build -p android --profile preview
```

When the build finishes, EAS gives you a download link and QR code for the `.apk`. For the Play Store, use
`npx.cmd eas-cli@latest build -p android --profile production` (it produces an `.aab` bundle).

App identity is in `app.json`: name **Kleos School**, package `in.kleosschool.app`. The icons and splash screen
in `assets/images` are generated from the Kleos laurel logo.

## How it fits with the website

- The app **reuses the website's data and logic** (`../src/data`, `../src/utils`, `../src/services/analytics.js`,
  `../src/services/api.js`) through the `@shared/*` alias, so school details, fees, classes and validation rules
  have a single source of truth. Edit `../src/data/school.js` once and both the website and the app change.
- For the demo, each device stores its own data (AsyncStorage), so a change made on the phone doesn't
  appear on the website. Connecting both to a shared backend is the next step; `src/lib/store.js` and
  `../src/services/api.js` are where that goes.

## Structure

```
src/
  app/                 Expo Router screens (file = route)
    index.js           welcome / role picker
    login.js
    guest/  parent/  student/  staff/     tab layouts per role
    event/[id] facility/[id] pupil/[id] application/[id] receipt/[id]
    events notices messages inbox leave timetable profile subjects
    my-attendance notifications compose collections
  components/          ui kit (Button, Card, Field, Sheet, Chips, Toast…), charts (SVG), nav, menus
  screens/portal.js    views shared by the parent & student apps
  lib/                 theme tokens, store (AsyncStorage), auth, admissions helpers, icon map
```
